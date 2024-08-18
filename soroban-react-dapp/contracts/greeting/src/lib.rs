#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

mod auth;
use auth::{AuthError, Key, check_auth, add_editor, eliminate_editor, search};

#[contract]
pub struct TitleContract;

#[contractimpl]
impl TitleContract {
    pub fn init(env: Env, admin: Address) -> Result<(), AuthError> {
        if env.storage().instance().has(&Key::Admin) {
            return Err(AuthError::Initialized);
        }
        env.storage().instance().set(&Key::Admin, &admin);
        Ok(())
    }

    pub fn set_title(env: Env, user: Address, title: String) -> Result<(), AuthError> {
        user.require_auth();
        if check_auth(&env, &user) {
            env.storage().instance().set(&Key::Title, &title);
            Ok(())
        } else {
            Err(AuthError::Unauthorized)
        }
    }

    pub fn read_title(env: Env) -> String {
        env.storage().instance().get(&Key::Title).unwrap_or(String::from_str(&env, "Default Title"))
    }

    pub fn add_editor(env: Env, admin: Address, new_editor: Address) -> Result<(), AuthError> {
        admin.require_auth();
        add_editor(&env, &admin, new_editor)
    }

    pub fn remove_editor(env: Env, admin: Address, editor_to_remove: Address) -> Result<(), AuthError> {
        admin.require_auth();
        eliminate_editor(&env, &admin, editor_to_remove)
    }

    pub fn search(env: Env) -> Vec<Address> {
        search(&env)
    }
}

#[cfg(test)]
mod test;