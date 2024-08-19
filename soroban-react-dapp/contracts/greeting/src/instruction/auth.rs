use crate::constants::*;
use soroban_sdk::{Address, Env, Vec};

// add editors
pub fn add_editor(env: Env, new_editor: Address) {
    let storage = env.storage().instance();
    let admin: Address = storage.get(&ADMIN).unwrap();
    admin.require_auth();

    let mut editors: Vec<Address> = storage.get(&EDITORS).unwrap_or(Vec::new(&env));
    if !editors.contains(&new_editor) {
        editors.push_front(new_editor);
        env.storage().instance().set(&EDITORS, &editors);
    }
}

// remove editor
pub fn remove_editor(env: Env, editor_to_remove: Address) {
    let storage = env.storage().instance();
    let admin: Address = storage.get(&ADMIN).unwrap();
    admin.require_auth();

    let mut editors: Vec<Address> = storage.get(&EDITORS).unwrap_or(Vec::new(&env));
    editors
        .first_index_of(&editor_to_remove)
        .map(|index| editors.remove(index));
    env.storage().instance().set(&EDITORS, &editors);
}

// read editors
pub fn read_editors(env: Env) -> Vec<Address> {
    let storage = env.storage().instance();
    let admin: Address = storage.get(&ADMIN).unwrap();
    let mut editors: Vec<Address> = storage.get(&EDITORS).unwrap_or(Vec::new(&env));
    editors.push_front(admin);
    editors
}
