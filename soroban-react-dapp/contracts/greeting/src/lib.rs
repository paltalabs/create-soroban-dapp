#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address, Map, panic_with_error};

const TITLE: Symbol = symbol_short!("TITLE");
const AUTHORIZED_ADDRESSES: Symbol = symbol_short!("AUTH_ADDRESSES");
const OWNER: Symbol = symbol_short!("OWNER");

// define the contract
#[contract]

// name the contract 
pub struct TitleContract;

// create an implementation
#[contractimpl]
impl TitleContract {

    // Constructor to set owner and title
    pub fn initialize(env: Env, default_title: String) {
        let owner = env.invoker(); 
        env.storage().instance().set(&OWNER, &owner);
        let mut auth_addresses: Map<Address, ()> = Map::new(&env);
        auth_addresses.set(owner.clone(), ());
        env.storage().instance().set(&AUTHORIZED_ADDRESSES, &auth_addresses);
    }


   // Only authorized callers can set title
   pub fn set_title(env: Env, title: String) {
    let caller = env.invoker();
    if !Self::is_authorized(&env, &caller) {
        panic_with_error!(&env, "Unauthorized: Only specific addresses can set the title.");
    }
    env.storage().instance().set(&TITLE, &title)
    }

    // Read title
    pub fn read_title(env: Env) -> String {
        env.storage().instance().get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }

    
     // Add address to authorized addresses
     pub fn add_authorized_address(env: Env, address: Address) {
        let caller = env.invoker();
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        if caller != owner {
            panic_with_error!(&env, "Unauthorized: Only the owner can maanage authorized addresses.");
        }
        let mut auth_addresses: Map<Address, ()> = env.storage().instance().get(&AUTHORIZED_ADDRESSES)
            .unwrap_or(Map::new(&env));
        auth_addresses.set(address, ());
        env.storage().instance().set(&AUTHORIZED_ADDRESSES, &auth_addresses);
    }

     // Remove address from authorized addresses
     pub fn remove_authorized_address(env: Env, address: Address) {
        let caller = env.invoker();
        let owner: Address = env.storage().instance().get(&OWNER).unwrap();
        if caller != owner {
            panic_with_error!(&env, "Unauthorized: Only the owner can manage authorized addresses.");
        }
        let mut auth_addresses: Map<Address, ()> = env.storage().instance().get(&AUTHORIZED_ADDRESSES)
            .unwrap_or(Map::new(&env));
        auth_addresses.remove(address);
        env.storage().instance().set(&AUTHORIZED_ADDRESSES, &auth_addresses);
    }

    // check for address authorization
    fn is_authorized(env: &Env, address: &Address) -> bool {
        let auth_addresses: Map<Address, ()> = env.storage().instance().get(&AUTHORIZED_ADDRESSES)
            .unwrap_or(Map::new(env));
        auth_addresses.contains_key(address)
    }
    
} 

mod test;
