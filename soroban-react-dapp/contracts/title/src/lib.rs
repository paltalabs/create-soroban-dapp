#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address, Map, contracterror};

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
    // Configura el administrador del contrato
    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&ADMIN) {
            Err(ContractError::NotInitialized)
        } else {
            env.storage().instance().set(&ADMIN, &new_admin);
            Ok(())
        }
    }

    // Agrega una dirección autorizada para modificar el título
    pub fn add_user(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut authorized_users: Map<Address, bool> = env.storage().instance().get(&AUTH_USERS).unwrap_or(Map::new(&env));
        authorized_users.set(user, true);
        env.storage().instance().set(&AUTH_USERS, &authorized_users);
    }

    // Modifica el título si la dirección está autorizada
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

    // Obtiene el título actual
    pub fn get_title(env: Env) -> String {
        env.storage().instance().get(&TITLE).unwrap_or(String::from_str(&env, "No Title Set"))
    }

    // Obtiene la dirección del administrador del contrato
    pub fn address_admin(env: Env) -> Result<Address, ContractError> {
        match env.storage().instance().get(&ADMIN) {
            Some(admin_address) => Ok(admin_address),
            None => Err(ContractError::NotInitialized),
        }
    }
}
