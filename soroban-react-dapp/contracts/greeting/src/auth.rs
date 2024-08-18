use soroban_sdk::{Address, Env, Vec, contracterror, contracttype};

#[contracttype]
pub enum Key {
    Title,
    Admin,
    Editors,
}

#[contracterror]
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AuthError {
    Unauthorized = 1,
    Initialized = 2,
    AdminNotFound = 3,
    EditorAlreadyExists = 4,
    EditorNotFound = 5,
    OperationFailed = 6,
}

pub fn check_auth(env: &Env, user: &Address) -> bool {
    let admin: Address = match env.storage().instance().get(&Key::Admin) {
        Some(admin) => admin,
        None => return false, // Admin not found
    };
    let editors: Vec<Address> = env.storage().instance().get(&Key::Editors).unwrap_or(Vec::new(env));
    editors.contains(user) || user == &admin
}

pub fn search(env: &Env) -> Vec<Address> {
    let admin: Address = match env.storage().instance().get(&Key::Admin) {
        Some(admin) => admin,
        None => return Vec::new(env), // Admin not found
    };
    let mut editors: Vec<Address> = env.storage().instance().get(&Key::Editors).unwrap_or(Vec::new(env));
    editors.push_back(admin); // Assuming `push_back` is available
    editors
}

pub fn add_editor(env: &Env, admin: &Address, new_editor: Address) -> Result<(), AuthError> {
    let stored_admin: Address = match env.storage().instance().get(&Key::Admin) {
        Some(admin) => admin,
        None => return Err(AuthError::AdminNotFound),
    };
    if admin != &stored_admin {
        return Err(AuthError::Unauthorized);
    }
    let mut editors: Vec<Address> = env.storage().instance().get(&Key::Editors).unwrap_or(Vec::new(env));
    if !editors.contains(&new_editor) {
        editors.push_back(new_editor);
        env.storage().instance().set(&Key::Editors, &editors);
    }
    Ok(())
}

pub fn eliminate_editor(env: &Env, admin: &Address, editor_to_remove: Address) -> Result<(), AuthError> {
    let stored_admin: Address = match env.storage().instance().get(&Key::Admin) {
        Some(admin) => admin,
        None => return Err(AuthError::AdminNotFound),
    };
    if admin != &stored_admin {
        return Err(AuthError::Unauthorized);
    }
    let mut editors: Vec<Address> = env.storage().instance().get(&Key::Editors).unwrap_or(Vec::new(env));
    if let Some(index) = editors.first_index_of(&editor_to_remove) {
        editors.remove(index);
        env.storage().instance().set(&Key::Editors, &editors);
    } else {
        return Err(AuthError::EditorNotFound);
    }
    Ok(())
}
