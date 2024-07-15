#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, Map, Address, String};

const VOTES: Symbol = symbol_short!("VOTES");

#[contract]
pub struct VotingContract;

#[contractimpl]
impl VotingContract {

    pub fn vote(env: Env, voter: Address, option: String) {
        voter.require_auth();
        
        let mut votes: Map<Address, String> = env.storage().instance().get(&VOTES).unwrap_or(Map::new(&env));
        votes.set(voter.clone(), option);
        env.storage().instance().set(&VOTES, &votes);
    }

    pub fn get_votes(env: Env) -> Map<Address, String> {
        env.storage().instance().get(&VOTES).unwrap_or(Map::new(&env))
    }

}

mod test;