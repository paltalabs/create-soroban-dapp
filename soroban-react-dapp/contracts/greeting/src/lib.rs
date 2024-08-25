#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, Env, Symbol, symbol_short, String, Address};


#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum DataKey {
    Map(Address),
    Owner,
}

const TITLE: Symbol = symbol_short!("TITLE");


#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {

    pub fn init(env: Env, addr: Address) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("owner is already set");
        }
        env.storage().instance().set(&DataKey::Owner, &addr);
        env.storage().persistent().set(&DataKey::Map(addr.clone()), &true);
    }


    pub fn read_title(env: Env) -> String {
        env.storage().instance().get(&TITLE)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }

    pub fn set_title(env: Env, title: String, addr: Address) {
        let is_auth = env.storage().persistent().get(&DataKey::Map(addr.clone())).unwrap_or(false);
        
        if is_auth {
                addr.require_auth();
                env.storage().instance().set(&TITLE, &title) 
            }
         else{
            panic!("Not authorize to set title")
         }
          
    }

    pub fn get_auth_addr(env: &Env, addr: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Map(addr))
            .unwrap_or(false)
    }

    pub fn set_auth_addr(env: &Env, owner_addr: Address, new_addr: Address) {
         let owner = env.storage().instance().get(&DataKey::Owner);
         if owner == core::prelude::v1::Some(owner_addr.clone()) {
            owner_addr.require_auth();
            env.storage().persistent().set(&DataKey::Map(new_addr.clone()), &true);
        } else {
            panic!("caller not authorized");
        }
    }

    pub fn restrict_auth_addr(env: &Env, owner_addr: Address, new_addr: Address) {
         let owner = env.storage().instance().get(&DataKey::Owner);
         if owner == core::prelude::v1::Some(owner_addr.clone()) {
            owner_addr.require_auth();
            env.storage().persistent().set(&DataKey::Map(new_addr.clone()), &false);
        } else {
            panic!("caller not authorized");
        }
    }
    
} 

mod test;