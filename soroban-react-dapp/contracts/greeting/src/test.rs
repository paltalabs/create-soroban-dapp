#![cfg(test)]

use super::*;
use soroban_sdk::{   Env, String, Address , testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation,},};


#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);
    
    // address for owner and another user
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let unauthorize_user = Address::generate(&env);

    // Initialize the contract with owner
    client.init(&owner);

    let client_default_title = client.read_title(); 
    assert_eq!(client_default_title, String::from_slice(&env, "Default Title"));

    // owner adds user to authorized addresses
    client.set_auth_addr(&owner, &user);

    // added user can set the title
    client.set_title(&String::from_slice(&env, "My New Title"),&user);
    let client_new_title = client.read_title(); 
    assert_eq!(client_new_title, String::from_slice(&env, "My New Title"));

}