#![cfg(test)]

use super::*;
use soroban_sdk::{Env, Address, String};

// Helper function to create an address for testing
fn create_address(env: &Env, id: u32) -> Address {
    Address::from_id(env, &id.to_le_bytes())
}

#[test]
fn test_initialize() {
    let env = Env::default();
    let admin = create_address(&env, 1);
    
    AuthorizedGreetingContract::initialize(env.clone(), admin.clone());

    // Verify that the admin was set correctly
    let stored_admin = AuthorizedGreetingContract::get_admin(&env);
    assert_eq!(admin, stored_admin);
}

#[test]
fn test_add_greeter() {
    let env = Env::default();
    let admin = create_address(&env, 1);
    let greeter = create_address(&env, 2);

    AuthorizedGreetingContract::initialize(env.clone(), admin.clone());
    
    // Add a greeter as the admin
    env.as_invoker(admin.clone(), || {
        AuthorizedGreetingContract::add_greeter(env.clone(), greeter.clone());
    });

    // Verify that the greeter was added to the authorized list
    let authorized_greeter_list = AuthorizedGreetingContract::get_authorized_greeter_list(&env);
    assert_eq!(authorized_greeter_list.get(greeter.clone()), Some(true));
}

#[test]
fn test_set_greet() {
    let env = Env::default();
    let admin = create_address(&env, 1);
    let greeter = create_address(&env, 2);
    let greet_message = String::from_str(&env, "Hello, Soroban!");

    AuthorizedGreetingContract::initialize(env.clone(), admin.clone());
    
    // Add a greeter as the admin
    env.as_invoker(admin.clone(), || {
        AuthorizedGreetingContract::add_greeter(env.clone(), greeter.clone());
    });

    // Set the greeting as the authorized greeter
    env.as_invoker(greeter.clone(), || {
        AuthorizedGreetingContract::set_greet(env.clone(), greeter.clone(), greet_message.clone());
    });

    // Verify that the greeting message was set correctly
    let stored_greet = AuthorizedGreetingContract::read_greet(env.clone());
    assert_eq!(stored_greet, greet_message);
}

#[test]
#[should_panic(expected = "require_auth")]
fn test_unauthorized_add_greeter() {
    let env = Env::default();
    let admin = create_address(&env, 1);
    let greeter = create_address(&env, 2);
    let unauthorized_user = create_address(&env, 3);

    AuthorizedGreetingContract::initialize(env.clone(), admin.clone());

    // Try to add a greeter with an unauthorized user
    env.as_invoker(unauthorized_user.clone(), || {
        AuthorizedGreetingContract::add_greeter(env.clone(), greeter.clone());
    });
}

#[test]
#[should_panic(expected = "require_auth")]
fn test_unauthorized_set_greet() {
    let env = Env::default();
    let admin = create_address(&env, 1);
    let greeter = create_address(&env, 2);
    let unauthorized_user = create_address(&env, 3);
    let greet_message = String::from_str(&env, "Hello, Soroban!");

    AuthorizedGreetingContract::initialize(env.clone(), admin.clone());
    
    // Add a greeter as the admin
    env.as_invoker(admin.clone(), || {
        AuthorizedGreetingContract::add_greeter(env.clone(), greeter.clone());
    });

    // Try to set the greeting as an unauthorized user
    env.as_invoker(unauthorized_user.clone(), || {
        AuthorizedGreetingContract::set_greet(env.clone(), greeter.clone(), greet_message.clone());
    });
}
