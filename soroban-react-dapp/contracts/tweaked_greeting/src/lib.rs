#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, String, Symbol};

const TITLE: Symbol = symbol_short!("TITLE");

#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    pub fn set_title(env: Env, _title: String) {
        env.storage().instance().set(
            &TITLE,
            &"You will never be able to change this title anymmore",
        )
    }

    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
}

mod test;
