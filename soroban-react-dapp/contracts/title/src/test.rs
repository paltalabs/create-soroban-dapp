#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, Symbol, Vec, String};
use crate::{TitleContract, TitleContractClient, ContractError, ADMIN, TITLE, AUTH_USERS};

#[test]
fn test_set_admin() {
    let env = Env::default();
    let admin = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));

    // Setting the admin
    client.set_admin(&admin).unwrap();

    // Verify the admin was set correctly
    assert_eq!(env.storage().instance().get::<Address>(&ADMIN).unwrap(), admin);
}

#[test]
fn test_add_user() {
    let env = Env::default();
    let admin = Address::random(&env);
    let user = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));

    // Set the admin
    client.set_admin(&admin).unwrap();

    // Add a user as admin
    env.set_authorized(&admin, true);
    client.add_user(&user);

    // Verify the user was added
    let authorized_users: Vec<(Address, bool)> = env.storage().instance().get(&AUTH_USERS).unwrap().iter().collect();
    assert!(authorized_users.iter().any(|(addr, _)| *addr == user));
}

#[test]
fn test_modify_title() {
    let env = Env::default();
    let admin = Address::random(&env);
    let user = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));
    let new_title = String::from_str(&env, "New Title");

    // Set the admin and add a user
    client.set_admin(&admin).unwrap();
    env.set_authorized(&admin, true);
    client.add_user(&user);

    // Modify the title as the authorized user
    env.set_authorized(&user, true);
    client.modify_title(&user, &new_title).unwrap();

    // Verify the title was modified
    assert_eq!(client.get_title(), new_title);
}

#[test]
fn test_unauthorized_modify_title() {
    let env = Env::default();
    let user = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));
    let new_title = String::from_str(&env, "New Title");

    // Attempt to modify title without authorization
    env.set_authorized(&user, true);
    let result = client.modify_title(&user, &new_title);

    // Verify that the modification failed due to lack of authorization
    assert_eq!(result, Err(ContractError::NotAuthorized));
}

#[test]
fn test_get_title() {
    let env = Env::default();
    let admin = Address::random(&env);
    let user = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));
    let new_title = String::from_str(&env, "New Title");

    // Set the admin, add a user, and modify the title
    client.set_admin(&admin).unwrap();
    env.set_authorized(&admin, true);
    client.add_user(&user);
    env.set_authorized(&user, true);
    client.modify_title(&user, &new_title).unwrap();

    // Retrieve and verify the title
    assert_eq!(client.get_title(), new_title);
}

#[test]
fn test_address_admin() {
    let env = Env::default();
    let admin = Address::random(&env);
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));

    // Set the admin
    client.set_admin(&admin).unwrap();

    // Verify that the admin address is returned correctly
    assert_eq!(client.address_admin().unwrap(), admin);
}

#[test]
fn test_address_admin_not_initialized() {
    let env = Env::default();
    let client = TitleContractClient::new(&env, &env.register_contract(None, TitleContract));

    // Attempt to retrieve admin address without setting it
    let result = client.address_admin();

    // Verify that an error is returned due to the admin not being initialized
    assert_eq!(result, Err(ContractError::NotInitialized));
}
