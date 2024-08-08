#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);
    let instantiator = Address::generate(&env);
    let new_admin = Address::generate(&env);
    client.init(&instantiator);

    let client_default_title = client.read_title();
    assert_eq!(
        client_default_title,
        String::from_str(&env, "Default Title")
    );

    // change title with new admin and assert that it is not changed
    let _ = client.try_set_title(&new_admin, &String::from_str(&env, "My New Title"));
    let client_title = client.read_title();
    assert_eq!(client_title, String::from_str(&env, "Default Title"));

    // add new admin
    client.add_admin(&new_admin);

    // load list of admins and assert that new admin is in the list
    let admins = client.read_admins();
    assert_eq!(admins.len(), 2);
    assert_eq!(&admins.last().unwrap(), &new_admin);

    // change title with new_admin and assert that it is changed
    client.set_title(&new_admin, &String::from_str(&env, "My New Title"));
    let client_new_title = client.read_title();
    assert_eq!(client_new_title, String::from_str(&env, "My New Title"));

    // change title with instantiator and assert that it is changed
    client.set_title(&instantiator, &String::from_str(&env, "My New Title 2"));
    let client_new_title_2 = client.read_title();
    assert_eq!(client_new_title_2, String::from_str(&env, "My New Title 2"));

    // remove admin and assert that it is removed
    let _ = client.try_remove_admin(&new_admin);
    let admins = client.read_admins();
    assert_eq!(admins.len(), 1); // instantiator is the only admin left
}
