#![no_std]
use soroban_sdk::{contract, contractimpl, contracterror, Env, Symbol, symbol_short, Map, Address, String};

const ADMIN: Symbol = symbol_short!("ADMIN");
const VOTES: Symbol = symbol_short!("VOTES");
const AUTH_VTRS: Symbol = symbol_short!("AUTH_VTRS");

#[contract]
pub struct VotingContract;


#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 400,
    NotAuthorized = 401,
}


#[contractimpl]
impl VotingContract {
    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&ADMIN) {
            Err(ContractError::NotInitialized)
        } else {
            env.storage().instance().set(&ADMIN, &new_admin);
            Ok(())
        }
    }

    pub fn add_voter(env: Env, voter: Address) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        
        let mut authorized_voters: Map<Address, bool> = env.storage().instance().get(&AUTH_VTRS).unwrap_or(Map::new(&env));
        authorized_voters.set(voter, true);
        env.storage().instance().set(&AUTH_VTRS, &authorized_voters);
    }

    pub fn vote(env: Env, voter: Address, option: String) -> Result<(), ContractError> {
        voter.require_auth();
        
        // let mut votes: Map<Address, String> = env.storage().instance().get(&VOTES).unwrap_or(Map::new(&env));
        // votes.set(voter.clone(), option);
        // env.storage().instance().set(&VOTES, &votes);

        let authorized_voters: Map<Address, bool> = env.storage().instance().get(&AUTH_VTRS).unwrap_or(Map::new(&env));
        if authorized_voters.get(voter.clone()).unwrap_or(false) {
            let mut votes: Map<String, u32> = env.storage().instance().get(&VOTES).unwrap_or(Map::new(&env));
            let count = votes.get(option.clone()).unwrap_or(0);
            votes.set(option, count + 1);
            env.storage().instance().set(&VOTES, &votes);
            Ok(())
        } else {
            Err(ContractError::NotAuthorized)
        }
    }

    pub fn get_votes(env: Env) -> Map<String, u32> {
        env.storage().instance().get(&VOTES).unwrap_or(Map::new(&env))
    }

}

mod test;