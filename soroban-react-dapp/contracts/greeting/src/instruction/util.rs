use crate::constants::*;
use crate::error::Error;
use soroban_sdk::{Address, Env, String, Vec};

// set the title
// only editors can set it
pub fn set_title(env: Env, editor: Address, title: String) -> Result<(), Error> {
    editor.require_auth();
    let storage = env.storage().instance();
    let admin: Address = storage.get(&ADMIN).unwrap();
    let editors: Vec<Address> = storage.get(&EDITORS).unwrap_or(Vec::new(&env));
    if editors.contains(&editor) || editor.eq(&admin) {
        env.storage().instance().set(&TITLE, &title);
        Ok(())
    } else {
        Err(Error::Unauthorized)
    }
}

// read the title
pub fn read_title(env: Env) -> String {
    env.storage()
        .instance()
        .get(&TITLE)
        .unwrap_or(String::from_str(&env, "Default Title"))
}
