#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, symbol_short, Address, Env, Map, String, Symbol,
};

// custom error for this contract
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    Uninitialized = 1,
    Unauthorized = 2,
    DuplicateOperation = 3,
}

const TITLE: Symbol = symbol_short!("TITLE");
const OWNER: Symbol = symbol_short!("OWNER");
const ALLOWED: Symbol = symbol_short!("ALLOWED");

#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    pub fn init(env: Env, owner: Address) -> Result<(), Error> {
        if env.storage().instance().has(&OWNER) {
            return Err(Error::DuplicateOperation);
        } else {
            env.storage().instance().set(&OWNER, &owner);
        };

        Ok(())
    }

    pub fn add_allowed(env: Env, user: Address) -> Result<(), Error> {
        if let Some(owner) = get_owner(env.clone()) {
            owner.require_auth();

            let mut allowed: Map<Address, bool> = env
                .storage()
                .instance()
                .get(&ALLOWED)
                .unwrap_or(Map::new(&env));

            if allowed.get(user.clone()).is_some() {
                return Err(Error::DuplicateOperation);
            }

            allowed.set(user, true);
            env.storage().instance().set(&ALLOWED, &allowed);

            return Ok(());
        }
        Err(Error::Uninitialized)
    }

    pub fn remove_allowed(env: Env, user: Address) -> Result<(), Error> {
        if let Some(owner) = get_owner(env.clone()) {
            owner.require_auth();

            let mut allowed: Map<Address, bool> = env
                .storage()
                .instance()
                .get(&ALLOWED)
                .unwrap_or(Map::new(&env));

            if allowed.get(user.clone()).is_some() {
                allowed.remove(user);
                env.storage().instance().set(&ALLOWED, &allowed);

                return Ok(());
            }

            return Err(Error::Uninitialized);
        }

        Err(Error::Uninitialized)
    }

    pub fn set_title(env: Env, title: String, user: Address) -> Result<(), Error> {
        user.require_auth();

        if Some(user.clone()) == get_owner(env.clone()) {
            env.storage().instance().set(&TITLE, &title);
            return Ok(());
        }

        if let Some::<Map<Address, bool>>(allowed) = env.storage().instance().get(&ALLOWED) {
            if let Some(is_allowed) = allowed.get(user.clone()) {
                if is_allowed {
                    env.storage().instance().set(&TITLE, &title);
                    return Ok(());
                }
            }
            return Err(Error::Unauthorized);
        }
        Err(Error::Uninitialized)
    }

    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
}

fn get_owner(env: Env) -> Option<Address> {
    env.storage().instance().get(&OWNER)
}

mod test;
