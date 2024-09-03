#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, Map, String,
    Symbol,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotPermission = 2,
    AdminNotExist = 3,
}

const USER_LIST: Symbol = symbol_short!("USER_LIST");

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
    pub fn init(env: Env, admin: Address, title: String) -> Result<(), Error> {
        if env.storage().instance().has(&AdminInfo::Initialized) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&AdminInfo::Initialized, &());

        // Initialize the admin info
        env.storage().instance().set(&AdminInfo::Admin, &admin);
        env.storage().instance().set(&AdminInfo::Title, &title);
        env.events()
            .publish(("AccessControl", symbol_short!("init")), title);
        Ok(())
    }

    // Add or remove the manager to set the title
    // Should add checking the current status of the user to avoid the duplication set/removal
    pub fn set_user(env: &Env, user: Address, is_add: bool) -> Result<(), Error> {
        let admin: Address = Self::get_admin(env);
        admin.require_auth();

        let mut user_list = env
            .storage()
            .instance()
            .get(&USER_LIST)
            .unwrap_or(Map::<Address, bool>::new(env));

        user_list.set(user.clone(), is_add);
        env.storage().instance().set(&USER_LIST, &user_list);
        env.events()
            .publish(("AccessControl", symbol_short!("set_user"), user), is_add);
        Ok(())
    }

    // Set the admin title
    pub fn set_title(env: Env, user: Address, title: String) -> Result<(), Error> {
        user.require_auth();

        // Check if the user has the permission to set the admin title
        if Self::check_user(&env, user) {
            // Set the admin title
            env.storage().instance().set(&AdminInfo::Title, &title);
            env.events()
                .publish(("AccessControl", symbol_short!("set")), title);
            Ok(())
        } else {
            Err(Error::NotPermission)
        }
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

    // Check if the user is avaialble to set the title
    pub fn check_user(env: &Env, user: Address) -> bool {
        let user_list = env
            .storage()
            .instance()
            .get(&USER_LIST)
            .unwrap_or(Map::<Address, bool>::new(env));

        user_list.get(user).unwrap_or(false)
    }
}

mod test;
