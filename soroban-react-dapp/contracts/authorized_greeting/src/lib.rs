#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address, Map};

const GREET: Symbol = symbol_short!("GREET");
const AUTH_GRTRS: Symbol = symbol_short!("AUTH_GTRS");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct AuthorizedGreetingContract;

#[contractimpl]
impl AuthorizedGreetingContract {
    pub fn get_authorized_greeter_list(env: &Env) -> Map<Address, bool> {
        env.storage().instance().get(&AUTH_GRTRS).unwrap_or(Map::new(env))
    }

    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
    }

    pub fn get_admin(env: &Env) -> Address {
        env.storage().instance().get(&ADMIN).expect("Admin not set in storage")
    }

    pub fn add_greeter(env: Env, greeter: Address) {
        let admin = Self::get_admin(&env);  
        admin.require_auth();

        let mut authorized_greeter_list = Self::get_authorized_greeter_list(&env);
        authorized_greeter_list.set(greeter, true);
        env.storage().instance().set(&AUTH_GRTRS, &authorized_greeter_list);
    }

    pub fn set_greet(env: Env, greeter: Address, greet: String) {
        greeter.require_auth();

        let authorized_greeter_list = Self::get_authorized_greeter_list(&env);
        let greeter_is_authorized = authorized_greeter_list.get(greeter.clone()).unwrap_or(false);

        if greeter_is_authorized {
            env.storage().instance().set(&GREET, &greet);
        }
    }

    pub fn read_greet(env: Env) -> String {
        env.storage().instance().get(&GREET).unwrap_or(String::from_str(&env, ""))
    }
}

mod test;
