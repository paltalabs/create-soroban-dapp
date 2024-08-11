#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test() {
    // test to mock the all auths
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let new_editor = Address::generate(&env);

    // init by admin
    client.init(&admin);

    let client_default_title = client.read_title();
    assert_eq!(
        client_default_title,
        String::from_str(&env, "Default Title")
    );

    // test either everyone access to modify title or not
    let _ = client.try_set_title(&new_editor, &String::from_str(&env, "Hello, Stellar"));
    let client_title = client.read_title();
    assert_eq!(client_title, String::from_str(&env, "Default Title"));

    // give edit access
    client.add_editor(&new_editor);

    // mofify the title with editors
    client.set_title(&new_editor, &String::from_str(&env, "Hello, Stellar"));
    let client_new_title = client.read_title();
    assert_eq!(client_new_title, String::from_str(&env, "Hello, Stellar"));

    // remove editors by admin
    let _ = client.remove_editor(&new_editor);
    let admins = client.fetch_editors();
    assert_eq!(admins.len(), 0);
}
