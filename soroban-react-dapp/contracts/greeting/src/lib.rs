#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, String, Vec};
#[contract]
pub struct TitleContract;

#[contracterror]
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    Unauthorized = 1,
}

#[contractimpl]
impl TitleContract {
    pub fn init(env: Env, instantiator: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        instantiator.require_auth();
        if storage.has(&DataKey::Instantiator) {
            return Err(Error::Unauthorized);
        }
        storage.set(&DataKey::Instantiator, &instantiator);
        Ok(())
    }

    // sets the title in the storage
    pub fn set_title(env: Env, caller: Address, title: String) -> Result<(), Error> {
        caller.require_auth();
        let storage = env.storage().instance();
        let instantiator: Address = storage.get(&DataKey::Instantiator).unwrap();
        let admins: Vec<Address> = storage.get(&DataKey::Admins).unwrap_or(Vec::new(&env));
        if admins.contains(&caller) || caller.eq(&instantiator) {
            env.storage().instance().set(&DataKey::Title, &title);
            Ok(())
        } else {
            Err(Error::Unauthorized)
        }
    }

    // reads the title from the storage
    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&DataKey::Title)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }

    // adds a new admin to the list of admins, only the instantiator can add an admin
    pub fn add_admin(env: Env, new_admin: Address) {
        let storage = env.storage().instance();
        let instantiator: Address = storage.get(&DataKey::Instantiator).unwrap();
        instantiator.require_auth();

        let mut admins: Vec<Address> = storage.get(&DataKey::Admins).unwrap_or(Vec::new(&env));
        if !admins.contains(&new_admin) {
            admins.push_front(new_admin);
            env.storage().instance().set(&DataKey::Admins, &admins);
        }
    }

    // removes an admin from the list of admins, only the instantiator can remove an admin
    pub fn remove_admin(env: Env, admin_to_remove: Address) {
        let storage = env.storage().instance();
        let instantiator: Address = storage.get(&DataKey::Instantiator).unwrap();
        instantiator.require_auth();

        let mut admins: Vec<Address> = storage.get(&DataKey::Admins).unwrap_or(Vec::new(&env));
        admins
            .first_index_of(&admin_to_remove)
            .map(|index| admins.remove(index));
        env.storage().instance().set(&DataKey::Admins, &admins);
    }

    // reads the list of admins from the storage
    pub fn read_admins(env: Env) -> Vec<Address> {
        let storage = env.storage().instance();
        let instantiator: Address = storage.get(&DataKey::Instantiator).unwrap();
        let mut admins: Vec<Address> = storage.get(&DataKey::Admins).unwrap_or(Vec::new(&env));
        admins.push_front(instantiator);
        admins
    }
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Instantiator,
    Admins,
    Title,
}

mod test;
