#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _}, Address, Env, String};

#[test]
fn test_voting_contract() {
    // Initialize environment and entities
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    // Test initial votes map is empty
    let client_votes: Map<Address, String> = client.get_votes();
    assert_eq!(client_votes, Map::new(&env));

    // Cast a vote
    client.vote(&admin, &String::from_str(&env, "list1"));

    // Retrieve updated votes and verify the vote
    let client_new_votes: Map<Address, String> = client.get_votes();
    let mut expected_votes = Map::new(&env);
    expected_votes.set(admin.clone(), String::from_str(&env, "list1"));
    
    assert_eq!(client_new_votes, expected_votes);
}