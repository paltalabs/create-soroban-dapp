#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Address};


#[test]
fn test() {
    let env = Env::default();

     //  address for owner and another user
     let owner = Address::random(&env);
     let user = Address::random(&env);
     let unauthorized_user = Address::random(&env);


    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    // Initialize the contract
    client.initialize(&owner, &String::from_slice(&env, "Default Title"));

    let client_default_title = client.read_title(); 
    assert_eq!(client_default_title, String::from_slice(&env, "Default Title"));

    client.set_title(&owner, &String::from_slice(&env, "My New Title"));
    let client_new_title = client.read_title(); 
    assert_eq!(client_new_title, String::from_slice(&env, "My New Title"));

    // should fail if a user not yet authorize try to set tile
    env.test_catch_panic(|| {
        client.set_title(&user, &String::from_slice(&env, "Unauthorized Title"));
    });

     // TItle should remain unchanged
     let unchanged_title = client.read_title();
     assert_eq!(unchanged_title, String::from_slice(&env, "My New Title"));

    // should fail unauthorized user tries to add authorize address 
    env.test_catch_panic(|| {
        client.add_authorized_address(&unauthorized_user, &user);
    });

    // owner adds user to authorized addresses
    client.add_authorized_address(&owner, &user);

     //other user can set the title
     client.set_title(&user, &String::from_slice(&env, "Another New Title"));
     let another_new_title = client.read_title();
     assert_eq!(another_new_title, String::from_slice(&env, "Another New Title"));

     // Owner removes the user from the authorized list
      client.remove_authorized_address(&owner, &user);


      // user tries to set the title again (should fail)
      env.test_catch_panic(|| {
        client.set_title(&other_user, &String::from_slice(&env, "Unauthorized Title"));
      });

          // Ensure the title remains unchanged again
     let final_title = client.read_title();
     assert_eq!(final_title, String::from_slice(&env, "Another New Title"));

}
