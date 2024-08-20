#![cfg(test)]
extern crate std;

use ed25519_dalek::Keypair;
use ed25519_dalek::Signer;
use rand::thread_rng;
use soroban_sdk::auth::ContractContext;
use soroban_sdk::symbol_short;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::testutils::AuthorizedFunction;
use soroban_sdk::testutils::AuthorizedInvocation;
use soroban_sdk::Val;
use soroban_sdk::{ auth::Context, testutils::BytesN as _, vec, Address, BytesN, Env, IntoVal, Symbol, };
use soroban_sdk::testutils::Ledger;
use soroban_sdk::testutils::LedgerInfo;

use crate::AccError;
use crate::{AccountContract, AccountContractClient, Signature};

fn generate_keypair() -> Keypair {
	Keypair::generate(&mut thread_rng())
}

fn signer_public_key(e: &Env, signer: &Keypair) -> BytesN<32> {
	signer.public.to_bytes().into_val(e)
}

fn create_account_contract(e: &Env) -> AccountContractClient {
	AccountContractClient::new(e, &e.register_contract(None,
	AccountContract {}))
}

fn sign(e: &Env, signer: &Keypair, payload: &BytesN<32>) -> Val {
	Signature {
		public_key: signer_public_key(e, signer),
		signature: signer
			.sign(payload.to_array().as_slice())
			.to_bytes()
			.into_val(e),
	}
	.into_val(e)
}

fn token_auth_context(e: &Env, token_id: &Address, fn_name: Symbol, amount: i128) -> Context {
	Context::Contract(ContractContext {
		contract: token_id.clone(), fn_name,
		args: ((), (), amount).into_val(e),
	})
}

#[test]
fn test_token_auth() {
	let env = Env::default();
	env.mock_all_auths();
	let account_contract = create_account_contract(&env);
	let mut signers = [generate_keypair(), generate_keypair()];
	
	if signers[0].public.as_bytes() > signers[1].public.as_bytes() {
		signers.swap(0, 1);
	}
	
	account_contract.init(&vec![
	&env,
	signer_public_key(&env, &signers[0]),
	signer_public_key(&env, &signers[1]),
	]);
	
	let payload = BytesN::random(&env);
	let token = Address::generate(&env);
	env.try_invoke_contract_check_auth::<AccError>(
		&account_contract.address,
		&payload,
		vec![&env, sign(&env, &signers[0], &payload)].into(),
		&vec![&env, token_auth_context(&env, &token, Symbol::new(&env,"transfer"), 1000), ],
	)
	.unwrap();

	env.try_invoke_contract_check_auth::<AccError>(
		&account_contract.address,
		&payload,
		vec![&env, sign(&env, &signers[0], &payload)].into(),
		&vec![&env, token_auth_context(&env, &token, Symbol::new(&env,"transfer"), 1000), ],
	)
	.unwrap();

	// Add a time limit of 1000 seconds for the token.
	account_contract.set_time(&token, &1000);
	assert_eq!(
	env.auths(),
	std::vec![(
	account_contract.address.clone(),
	
	AuthorizedInvocation {
		function: AuthorizedFunction::Contract((
			account_contract.address.clone(),
			symbol_short!("set_time"),
			(token.clone(), 1000_u64).into_val(&env),
		)),
		sub_invocations: std::vec![]
	}
	)]
	);

	// Attempting a transfer within the time limit should fail.
	env.ledger().set(LedgerInfo {
		timestamp: 0,
		protocol_version: 1,
		sequence_number: 10,
		network_id: Default::default(),
		base_reserve: 10,
		min_temp_entry_ttl: 16,
		min_persistent_entry_ttl: 16,
		max_entry_ttl: 100_000,
	});
	
	env.try_invoke_contract_check_auth::<AccError>(
		&account_contract.address,
		&payload,
		vec![&env, sign(&env, &signers[0], &payload)].into(),
		&vec![&env, token_auth_context(&env, &token, Symbol::new(&env,"transfer"), 1001) ],
	)
	.err()
	.unwrap()
	.unwrap() == AccError::TimeLimitExceeded;
	
	// Simulate passing of time to allow the next transfer.
	env.ledger().set(LedgerInfo {
		timestamp: 1000,
		protocol_version: 1,
		sequence_number: 10,
		network_id: Default::default(),
		base_reserve: 10,
		min_temp_entry_ttl: 16,
		min_persistent_entry_ttl: 16,
		max_entry_ttl: 100_000,
	});
	
	env.try_invoke_contract_check_auth::<AccError>(
		&account_contract.address,
		&payload,
		vec![&env, sign(&env, &signers[0], &payload)].into(),
		&vec![&env, token_auth_context(&env, &token, Symbol::new(&env, "transfer"), 1001), ],
	)
	.unwrap();
}