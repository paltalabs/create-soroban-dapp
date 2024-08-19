#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol};

const TITLE: Symbol = symbol_short!("TITLE");

mod error;
mod instruction;

use error::Error;
use instruction::init::*;
#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    // init instruction to set admin
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        init(env, admin)
    }

    pub fn set_title(env: Env, title: String) {
        env.storage().instance().set(&TITLE, &title)
    }

    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
}

mod test;
