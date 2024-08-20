#![no_std]
use soroban_sdk::{
	auth::{Context, CustomAccountInterface}, contract, contracterror,
	contractimpl, contracttype, symbol_short, Address,
	BytesN, Env, Symbol, Vec,
};

#[contract]
struct AccountContract;

#[contracttype]
#[derive(Clone)]
pub struct Signature {
	pub public_key: BytesN<32>,
	pub signature: BytesN<64>,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
	SignerCnt,
	Signer(BytesN<32>),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AccError {
	NotEnoughSigners = 1,
	NegativeAmount = 2,
	BadSignatureOrder = 3,
	UnknownSigner = 4,
	InvalidContext = 5,
}

const CHANGE_TITLE_FN: Symbol = symbol_short!("set_title");

#[contractimpl]
impl AccountContract {
	pub fn init(env: Env, signers: Vec<BytesN<32>>) {
		for signer in signers.iter() {
			env.storage().instance().set(&DataKey::Signer(signer), &());
		}
		env.storage()
			.instance()
			.set(&DataKey::SignerCnt, &signers.len());
	}
}

#[contractimpl]
impl CustomAccountInterface for AccountContract {
type Error = AccError;
type Signature = Vec<Signature>;

#[allow(non_snake_case)]
fn __required_auth(
	env: Env,
	signature_payload: BytesN<32>,
	signatures: Vec<Signature>,
	auth_context: Vec<Context>,
	) -> Result<(), AccError> {
	
		authenticate(&env, &signature_payload, &signatures)?;
		let tot_signers: u32 = env
			.storage()
			.instance()
			.get::<_, u32>(&DataKey::SignerCnt)
			.unwrap();
		let all_signed = tot_signers == signatures.len();
		let curr_contract = env.current_contract_address();
		for context in auth_context.iter() {
			verify_authorization_policy(
			&env,
			&context,
			&curr_contract,
			all_signed,
			)?;
		}
		Ok(())
	}
}

fn authenticate(
env: &Env,
signature_payload: &BytesN<32>,
signatures: &Vec<Signature>,
) -> Result<(), AccError> {
	for i in 0..signatures.len() {
		let signature = signatures.get_unchecked(i);
		if i > 0 {
			let prev_signature = signatures.get_unchecked(i - 1);
			if prev_signature.public_key >= signature.public_key {
				return Err(AccError::BadSignatureOrder);
			}
		}
		if !env
			.storage()
			.instance()
			.has(&DataKey::Signer(signature.public_key.clone()))
		{
			return Err(AccError::UnknownSigner);
		}
		env.crypto().ed25519_verify(
		&signature.public_key,
		&signature_payload.clone().into(),
		&signature.signature,
		);
	}
	Ok(())
}

fn verify_authorization_policy(
	env: &Env,
	context: &Context,
	curr_contract: &Address,
	all_signed: bool,

	) -> Result<(), AccError> {
	
	let contract_context = match context {
		Context::Contract(c) => {
			if &c.contract == curr_contract {
				if !all_signed {
					return Err(AccError::NotEnoughSigners);
				}
			}
		}

		Context::CreateContractHostFn(_) => return Err(AccError::InvalidContext),
	};

	if contract_context.fn_name != CHANGE_TITLE_FN
	&& contract_context.fn_name != Symbol::new(env, "approve")
	{
		return Ok(());
	}

	Ok(())
}
mod test;