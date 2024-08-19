#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    // initialize to set admin
    client.init(&admin);
}

#[test]

fn test_add_editor() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let new_editor = Address::generate(&env);

    client.init(&admin);

    // add editor
    client.add_editor(&new_editor);

    let editors = client.read_editors();
    assert_eq!(editors.len(), 2);
}

#[test]

fn test_remove_editor() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let new_editor = Address::generate(&env);

    client.init(&admin);

    // add editor
    client.add_editor(&new_editor);

    // remove editor
    client.remove_editor(&new_editor);

    let editors = client.read_editors();
    assert_eq!(editors.len(), 1);
}

#[test]

fn test_set_title() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let new_editor = Address::generate(&env);

    client.init(&admin);

    // add editor
    client.add_editor(&new_editor);

    // verify to set title with editor
    client.set_title(&new_editor, &String::from_str(&env, "It's test title!"));
    let current_title = client.read_title();
    assert_eq!(current_title, String::from_str(&env, "It's test title!"));

    // remove editor
    client.remove_editor(&new_editor);

    // verify to not set with no-editor
    let result = client.try_set_title(&new_editor, &String::from_str(&env, "It's test title!"));
    assert!(result.is_err());
}
