#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

struct TitleContractTest<'a> {
    env: Env,
    contract: TitleContractClient<'a>,
    owner: Address,
    user_1: Address,
}

impl<'a> TitleContractTest<'a> {
    fn setup() -> Self {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TitleContract);
        let contract = TitleContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let user_1 = Address::generate(&env);

        contract.init(&owner);

        Self {
            env,
            contract,
            owner,
            user_1,
        }
    }
}

#[test]
fn test_default_title() {
    let test = TitleContractTest::setup();

    let client_default_title = test.contract.read_title();
    assert_eq!(
        client_default_title,
        String::from_str(&test.env, "Default Title")
    );
}

#[test]
#[should_panic]
fn test_only_authorized() {
    let test = TitleContractTest::setup();

    test.contract
        .set_title(&String::from_str(&test.env, "My New Title"), &test.user_1);
}

#[test]
fn test_owner_is_authorized() {
    let test = TitleContractTest::setup();

    test.contract
        .set_title(&String::from_str(&test.env, "My New Title"), &test.owner);

    let client_new_title = test.contract.read_title();
    assert_eq!(
        client_new_title,
        String::from_str(&test.env, "My New Title")
    );
}

#[test]
fn test_allowed_can_set_title() {
    let test = TitleContractTest::setup();

    test.contract.add_allowed(&test.user_1);

    test.contract
        .set_title(&String::from_str(&test.env, "User 1 Title"), &test.user_1);

    let client_new_title = test.contract.read_title();

    assert_eq!(
        client_new_title,
        String::from_str(&test.env, "User 1 Title")
    );
}
