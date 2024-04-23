#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String};

const TITLE: Symbol = symbol_short!("TITLE");


#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {

    pub fn set_title(env: Env, title: String) {
                env.storage().instance().set(&TITLE, &title)
    }

    pub fn read_title(env: Env) -> String {
        env.storage().instance().get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }
    
} 

mod test;
