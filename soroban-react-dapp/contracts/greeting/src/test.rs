#![cfg(test)]

extern crate std;

use super::*;
use soroban_sdk::{symbol_short, testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation}, vec, Address, Env, String};

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

    // test for require_auth
    assert_eq!(
        env.auths(),
        std::vec![(
            // Address for which authorization check is performed
            new_editor.clone(),
            // Invocation tree that needs to be authorized
            AuthorizedInvocation {
                // Function that is authorized. Can be a contract function or
                // a host function that requires authorization.
                function: AuthorizedFunction::Contract((
                    // Address of the called contract
                    contract_id.clone(),
                    // Name of the called function
                    symbol_short!("set_title"),
                    // Arguments used to call `set_title`
                    vec![&env, new_editor.to_val(), String::from_str(&env, "Hello, Stellar").into()]
                )),
                // The contract doesn't call any other contracts that require
                // authorization,
                sub_invocations: std::vec![]
            }
        )]
    );

    // test with new title 
    let client_new_title = client.read_title();
    assert_eq!(client_new_title, String::from_str(&env, "Hello, Stellar"));

    // remove editors by admin
    let _ = client.remove_editor(&new_editor);
    let admins = client.fetch_editors();
    assert_eq!(admins.len(), 1);
}
