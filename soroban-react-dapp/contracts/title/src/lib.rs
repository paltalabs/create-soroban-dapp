#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address, Map, Vec, contracterror};

const ADMIN: Symbol = symbol_short!("ADMIN");
const TITLE: Symbol = symbol_short!("TITLE");
const AUTH_USERS: Symbol = symbol_short!("AUTH_USER");

#[contract]
pub struct TitleContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized = 400,
    NotAuthorized = 401,
}

#[contractimpl]
impl TitleContract {
    // Sets the contract's administrator
    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&ADMIN) {
            Err(ContractError::NotInitialized)
        } else {
            env.storage().instance().set(&ADMIN, &new_admin);
            Ok(())
        }
    }

    // Adds an authorized address to modify the title
    pub fn add_user(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut authorized_users: Map<Address, bool> = env.storage().instance().get(&AUTH_USERS).unwrap_or(Map::new(&env));
        authorized_users.set(user, true);
        env.storage().instance().set(&AUTH_USERS, &authorized_users);
    }

    // Modifies the title if the address is authorized
    pub fn modify_title(env: Env, user: Address, new_title: String) -> Result<(), ContractError> {
        user.require_auth();

        let authorized_users: Map<Address, bool> = env.storage().instance().get(&AUTH_USERS).unwrap_or(Map::new(&env));
        if authorized_users.get(user.clone()).unwrap_or(false) {
            env.storage().instance().set(&TITLE, &new_title);
            Ok(())
        } else {
            Err(ContractError::NotAuthorized)
        }
    }

    // Retrieves the current title
    pub fn get_title(env: Env) -> String {
        env.storage().instance().get(&TITLE).unwrap_or(String::from_str(&env, "No Title Set"))
    }

    // Retrieves the contract's administrator address
    pub fn address_admin(env: Env) -> Result<Address, ContractError> {
        match env.storage().instance().get(&ADMIN) {
            Some(admin_address) => Ok(admin_address),
            None => Err(ContractError::NotInitialized),
        }
    }

    // Retrieves the authorized users who can modify the title
    pub fn get_users(env: Env) -> Vec<Address> {
        let authorized_users: Map<Address, bool> = env.storage().instance().get(&AUTH_USERS).unwrap_or(Map::new(&env));
        let mut users = Vec::new(&env);
        for user in authorized_users.keys() {
            users.append(&mut Vec::from_slice(&env, &[user]));
        }
        users
    }

    // Allows the current admin to transfer admin rights to a new address
    pub fn modify_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        env.storage().instance().set(&ADMIN, &new_admin);
        Ok(())
    }
}
