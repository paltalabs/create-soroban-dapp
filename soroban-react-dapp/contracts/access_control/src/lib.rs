#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Copy, Clone, Debug)]
pub enum AdminInfo {
    Initialized,
    Admin,
    Title,
}

#[contract]
pub struct AccessControl;

#[contractimpl]
impl AccessControl {
    // Initialize the admin info
    // This function should be called once when the contract is deployed
    pub fn init(env: Env, admin: Address, title: String) {
        if env.storage().instance().has(&AdminInfo::Initialized) {
            panic!("contract already initilized")
        };
        env.storage().instance().set(&AdminInfo::Initialized, &());

        // Initialize the admin info
        env.storage().instance().set(&AdminInfo::Admin, &admin);
        env.storage().instance().set(&AdminInfo::Title, &title);
        env.events()
            .publish(("AccessControl", symbol_short!("init")), title);
    }

    // Set the admin title
    pub fn set_title(env: Env, title: String) {
        let admin: Address = env.storage().instance().get(&AdminInfo::Admin).unwrap();
        admin.require_auth();

        // Set the admin title
        env.storage().instance().set(&AdminInfo::Title, &title);
        env.events()
            .publish(("AccessControl", symbol_short!("set")), title);
    }

    // Returns the admin address
    pub fn get_admin(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&AdminInfo::Admin)
            .expect("Admin not set")
    }

    // Returns the admin title
    pub fn get_admin_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&AdminInfo::Title)
            .unwrap_or(String::from_str(&env, ""))
    }
}

mod test;
