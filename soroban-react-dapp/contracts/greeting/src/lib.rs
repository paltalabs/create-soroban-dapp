#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String,
    Symbol, Vec,
};

const TITLE: Symbol = symbol_short!("TITLE");

#[contract]
pub struct TitleContract;

#[contracterror]
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    Unauthorized = 1,
    AlreadyInitialized = 2,
}

#[contractimpl]
impl TitleContract {
    // initialize the contract and set the admin
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        admin.require_auth();
        if storage.has(&Assets::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        storage.set(&Assets::Admin, &admin);
        Ok(())
    }

    // set the title only available editors
    pub fn set_title(env: Env, user: Address, title: String) -> Result<(), Error> {
        user.require_auth();
        let storage = env.storage().instance();
        let admin: Address = storage.get(&Assets::Admin).unwrap();
        let editors: Vec<Address> = storage.get(&Assets::Editors).unwrap_or(Vec::new(&env));
        if editors.contains(&user) || user.eq(&admin) {
            env.storage().instance().set(&Assets::Title, &title);
            Ok(())
        } else {
            Err(Error::Unauthorized)
        }
    }

    // read the title
    pub fn read_title(env: Env) -> String {
        env.storage()
            .instance()
            .get(&Assets::Title)
            .unwrap_or(String::from_str(&env, "Default Title"))
    }

    /// ***** Address Management ***** ///

    // add wallet address for editors
    pub fn add_editor(env: Env, new_editor: Address) {
        let storage = env.storage().instance();
        let admin: Address = storage.get(&Assets::Admin).unwrap();
        admin.require_auth();

        let mut editors: Vec<Address> = storage.get(&Assets::Editors).unwrap_or(Vec::new(&env));
        if !editors.contains(&new_editor) {
            editors.push_front(new_editor);
            env.storage().instance().set(&Assets::Editors, &editors);
        }
    }

    // remove wallets from editors
    pub fn remove_editor(env: Env, remover: Address) {
        let storage = env.storage().instance();
        let admin: Address = storage.get(&Assets::Admin).unwrap();
        admin.require_auth();

        let mut admins: Vec<Address> = storage.get(&Assets::Editors).unwrap_or(Vec::new(&env));
        admins
            .first_index_of(&remover)
            .map(|index| admins.remove(index));
        env.storage().instance().set(&Assets::Editors, &admins);
    }
}

#[derive(Clone)]
#[contracttype]
pub enum Assets {
    Admin,
    Editors,
    Title,
}

mod test;
