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
    NotInitialized = 400, // Error if contract is not initialized
    NotAuthorized = 401,  // Error if the user is not authorized
}

#[contractimpl]
impl TitleContract {
    // Sets the admin for the contract. Can only be called once.
    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        // Check if admin is already set; if yes, return an error
        if env.storage().instance().has(&ADMIN) {
            return Err(ContractError::NotInitialized);
        }
        // Set the new admin address in the storage
        env.storage().instance().set(&ADMIN, &new_admin);
        Ok(())
    }

    // Adds a new user to the list of authorized users. Only callable by the admin.
    pub fn add_user(env: Env, user: Address) -> Result<(), ContractError> {
        // Fetch the current admin from storage
        let admin = env.storage().instance().get::<Symbol, Address>(&ADMIN)
            .ok_or(ContractError::NotInitialized)?;
        // Ensure the caller is the admin
        admin.require_auth();

        // Get the list of authorized users or initialize it if it doesn't exist
        let mut authorized_users: Map<Address, bool> = env.storage().instance().get::<Symbol, Map<Address, bool>>(&AUTH_USERS).unwrap_or(Map::new(&env));
        // Add the new user to the list
        authorized_users.set(user, true);
        // Save the updated list back to storage
        env.storage().instance().set(&AUTH_USERS, &authorized_users);
        Ok(())
    }

    // Modifies the title. Only authorized users can call this.
    pub fn modify_title(env: Env, user: Address, new_title: String) -> Result<(), ContractError> {
        // Ensure the caller is the user who is trying to modify the title
        user.require_auth();

        // Fetch the list of authorized users from storage
        let authorized_users: Map<Address, bool> = env.storage().instance().get::<Symbol, Map<Address, bool>>(&AUTH_USERS).unwrap_or(Map::new(&env));
        // Check if the user is authorized
        if let Some(true) = authorized_users.get(user.clone()) {
            // Set the new title in storage
            env.storage().instance().set(&TITLE, &new_title);
            Ok(())
        } else {
            Err(ContractError::NotAuthorized)
        }
    }

    // Retrieves the current title. If not set, returns "No Title Set".
    pub fn get_title(env: Env) -> String {
        // Fetch the title from storage or return a default message
        env.storage().instance().get::<Symbol, String>(&TITLE).unwrap_or(String::from_str(&env, "No Title Set"))
    }

    // Retrieves the current admin address.
    pub fn address_admin(env: Env) -> Result<Address, ContractError> {
        // Fetch the admin from storage or return an error if not initialized
        env.storage().instance().get::<Symbol, Address>(&ADMIN).ok_or(ContractError::NotInitialized)
    }

    // Retrieves a list of all authorized users.
    pub fn get_users(env: Env) -> Vec<Address> {
        // Fetch the list of authorized users from storage
        let authorized_users: Map<Address, bool> = env.storage().instance().get::<Symbol, Map<Address, bool>>(&AUTH_USERS).unwrap_or(Map::new(&env));
        let mut users = Vec::new(&env);
        // Collect all user addresses into a Vec
        for user in authorized_users.keys() {
            users.append(&mut Vec::from_slice(&env, &[user]));
        }
        users
    }

    // Changes the admin address. Only the current admin can call this.
    pub fn modify_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        // Fetch the current admin from storage
        let admin = env.storage().instance().get::<Symbol, Address>(&ADMIN)
            .ok_or(ContractError::NotInitialized)?;
        // Ensure the caller is the current admin
        admin.require_auth();

        // Set the new admin address in storage
        env.storage().instance().set(&ADMIN, &new_admin);
        Ok(())
    }
}

mod test;
