#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol, Vec};

const TITLE: Symbol = symbol_short!("TITLE");

mod constants;
mod error;
mod instruction;

use error::Error;
use instruction::auth::*;
use instruction::init::*;
#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    // init instruction to set admin
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        init(env, admin)
    }

    // add editor
    pub fn add_editor(env: Env, new_editor: Address) {
        add_editor(env, new_editor)
    }

    // remove editor
    pub fn remove_editor(env: Env, editor_to_remove: Address) {
        remove_editor(env, editor_to_remove)
    }

    // read editors
    pub fn read_editors(env: Env) -> Vec<Address> {
        read_editors(env)
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
