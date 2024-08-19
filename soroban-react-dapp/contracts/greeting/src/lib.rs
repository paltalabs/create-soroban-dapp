#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, symbol_short, Address, Env, Map, String, Symbol,
};

const TITLE: Symbol = symbol_short!("TITLE");
const ADMIN: Symbol = symbol_short!("ADMIN");
const AUTH_USERS: Symbol = symbol_short!("AUTH_USRS");

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    Unauthorized = 1,
}

#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    pub fn set_title(env: Env, user: Address, title: String) -> Result<String, ContractError> {
        user.require_auth();

        let authorized_users: Map<Address, bool> = env
            .storage()
            .instance()
            .get(&AUTH_USERS)
            .unwrap_or(Map::new(&env));

        if authorized_users.get(user.clone()).unwrap_or(false)
            || user == env.storage().instance().get(&ADMIN).unwrap()
        {
            env.storage().instance().set(&TITLE, &title);
            Ok(title)
        } else {
            Err(ContractError::Unauthorized)
        }
    }

    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
}

mod test;
