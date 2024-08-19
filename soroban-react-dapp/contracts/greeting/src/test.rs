#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn e2e() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let default_title = String::from_str(&env, "Paltalabs Challenge");
    let default_authorized_users: Map<Address, bool> = Map::new(&env);

    let admin: Address = Address::generate(&env);
    let authorized_user: Address = Address::generate(&env);

    // test default values
    assert_eq!(client.get_title(), default_title);
    assert_eq!(client.get_authorized_users(), default_authorized_users);

    // first we need to add an admin user
    client.set_admin(&admin);

    assert_eq!(client.get_admin(), admin);

    // then we can add authorized users
    client.set_authorized_user(&authorized_user);

    let mut authorized_users = Map::new(&env);
    authorized_users.set(authorized_user.clone(), true);

    assert_eq!(client.get_authorized_users(), authorized_users);

    // test setting the title as an authorized user (it works with admin too)
    let new_title = String::from_str(&env, "Tomás Opazo - Paltalabs Dev :)");

    client.set_title(&authorized_user, &new_title);

    assert_eq!(client.get_title(), new_title);
}
