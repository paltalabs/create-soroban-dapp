#![cfg(test)]

use super::*;
use soroban_sdk::{Env, testutils::{Address as TestAddress, Vec as TestVec}, Symbol, String};

#[test]
fn test_set_admin() {
    let env = Env::default();
    let admin = TestAddress::random(&env);

    // Attempt to set the admin when it has not been initialized yet
    assert!(TitleContract::set_admin(env.clone(), admin.clone()).is_ok());

    // Attempt to set the admin again should fail
    assert_eq!(
        TitleContract::set_admin(env.clone(), admin.clone()).unwrap_err(),
        ContractError::NotInitialized
    );
}

#[test]
fn test_add_user_and_get_users() {
    let env = Env::default();
    let admin = TestAddress::random(&env);
    let user = TestAddress::random(&env);

    TitleContract::set_admin(env.clone(), admin.clone()).unwrap();
    TitleContract::add_user(env.clone(), user.clone());

    // Verify that the user appears in the list of authorized users
    let users = TitleContract::get_users(env.clone());
    assert_eq!(users.contains(&user), true);
}

#[test]
fn test_modify_title() {
    let env = Env::default();
    let admin = TestAddress::random(&env);
    let user = TestAddress::random(&env);
    let new_title = String::from_str(&env, "PrincesitoDan");

    TitleContract::set_admin(env.clone(), admin.clone()).unwrap();
    TitleContract::add_user(env.clone(), user.clone());

    // Attempt to modify the title by the authorized user
    assert!(TitleContract::modify_title(env.clone(), user.clone(), new_title.clone()).is_ok());

    // Verify that the title was modified
    assert_eq!(TitleContract::get_title(env.clone()), new_title);
}

#[test]
fn test_modify_admin() {
    let env = Env::default();
    let admin = TestAddress::random(&env);
    let new_admin = TestAddress::random(&env);

    TitleContract::set_admin(env.clone(), admin.clone()).unwrap();
    TitleContract::modify_admin(env.clone(), new_admin.clone()).unwrap();

    // Verify that only the new admin has the necessary permissions
    assert_eq!(TitleContract::address_admin(env.clone()).unwrap(), new_admin);
}
