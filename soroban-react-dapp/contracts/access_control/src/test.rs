#![cfg(test)]

extern crate std;

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, IntoVal,
};

#[test]
fn test_init() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    assert_eq!(client.get_admin(), admin);
    assert_eq!(client.get_admin_title(), admin_title);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #1)")]
fn test_init_again() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Initialize the contract again, should panic
    client.init(&admin, &admin_title);
}

#[test]
fn test_add_user_by_owner() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the initial user permission
    assert_eq!(client.check_user(&user), false);

    // Add the user
    client.set_user(&user, &true);
    assert_eq!(
        env.auths(),
        std::vec![(
            // Address for which authorization check is performed
            admin.clone(),
            // Invocation tree that needs to be authorized
            AuthorizedInvocation {
                // Function that is authorized. Can be a contract function or
                // a host function that requires authorization.
                function: AuthorizedFunction::Contract((
                    // Address of the called contract
                    contract_id.clone(),
                    // Name of the called function
                    symbol_short!("set_user"),
                    // Arguments used to call `set_user` (converted to the env-managed vector via `into_val`)
                    (user.clone(), true).into_val(&env),
                )),
                // The contract doesn't call any other contracts that require
                // authorization,
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(client.check_user(&user), true);
}

#[test]
fn test_remove_user_by_owner() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the initial user permission
    assert_eq!(client.check_user(&user), false);

    // Add the user
    client.set_user(&user, &true);
    assert_eq!(client.check_user(&user), true);

    // Remove the user
    client.set_user(&user, &false);
    assert_eq!(client.check_user(&user), false);
}

#[test]
#[should_panic(expected = "HostError: Error(Auth, InvalidAction)")]
fn test_set_user_by_non_owner() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Add the user, auth error
    client.set_user(&user, &true);
}

#[test]
fn test_set_title_by_user() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Add the user
    client.set_user(&user, &true);

    // Check a new title
    let new_admin_title = String::from_str(&env, "new_admin_title");
    client.set_title(&user, &new_admin_title);
    assert_eq!(
        env.auths(),
        std::vec![(
            // Address for which authorization check is performed
            user.clone(),
            // Invocation tree that needs to be authorized
            AuthorizedInvocation {
                // Function that is authorized. Can be a contract function or
                // a host function that requires authorization.
                function: AuthorizedFunction::Contract((
                    // Address of the called contract
                    contract_id.clone(),
                    // Name of the called function
                    symbol_short!("set_title"),
                    // Arguments used to call `set_title` (converted to the env-managed vector via `into_val`)
                    (user.clone(), new_admin_title.clone()).into_val(&env),
                    // vec![&env, user, user_title.into()]
                )),
                // The contract doesn't call any other contracts that require
                // authorization,
                sub_invocations: std::vec![]
            }
        )]
    );

    assert_eq!(client.get_admin_title(), new_admin_title);
}

#[test]
#[should_panic(expected = "HostError: Error(Contract, #2)")]
fn test_remove_user_by_removed_user() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the initial user permission
    assert_eq!(client.check_user(&user), false);

    // Add the user
    client.set_user(&user, &true);
    assert_eq!(client.check_user(&user), true);

    // Remove the user
    client.set_user(&user, &false);
    assert_eq!(client.check_user(&user), false);

    // Check a new title
    let new_admin_title = String::from_str(&env, "new_admin_title");
    client.set_title(&user, &new_admin_title);
}

#[test]
#[should_panic(expected = "HostError: Error(Auth, InvalidAction)")]
fn test_set_title_by_non_user() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the authorization, auth error
    let new_admin_title = String::from_str(&env, "new_admin_title");
    client.set_title(&admin, &new_admin_title);
}

#[test]
fn test_get_admin() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the admin address
    assert_eq!(client.get_admin(), admin);
}

#[test]
#[should_panic = "Admin not set"]
fn test_get_admin_before_init() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Check the admin address before the initialization, should panic
    assert_eq!(client.get_admin(), admin);
}

#[test]
fn test_get_admin_title() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize the contract
    let admin_title = String::from_str(&env, "admin_title");
    client.init(&admin, &admin_title);

    // Check the admin address
    assert_eq!(client.get_admin_title(), admin_title);
}

#[test]
fn test_get_admin_title_before_init() {
    let env = Env::default();

    let contract_id = env.register_contract(None, AccessControl);
    let client = AccessControlClient::new(&env, &contract_id);

    // Check the admin title before the initialization, should return the empty string
    assert_eq!(client.get_admin_title(), String::from_str(&env, ""));
}
