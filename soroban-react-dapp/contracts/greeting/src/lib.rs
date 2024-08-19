#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

mod constants;
mod error;
mod instruction;

use error::Error;
use instruction::auth::*;
use instruction::init::*;
use instruction::util::*;
#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    // initialze instruction to set admin
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

    // set title
    pub fn set_title(env: Env, editor: Address, title: String) -> Result<(), Error> {
        set_title(env, editor, title)
    }

    // read the title
    pub fn read_title(env: Env) -> String {
        read_title(env)
    }
}

mod test;
