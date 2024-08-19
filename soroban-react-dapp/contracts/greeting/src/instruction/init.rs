use crate::constants::*;
use crate::error::Error;
use soroban_sdk::{Address, Env};

// init instruction to set admin
pub fn init(env: Env, admin: Address) -> Result<(), Error> {
    let storage = env.storage().instance();
    admin.require_auth();
    if storage.has(&ADMIN) {
        return Err(Error::AlreadyInitialized);
    }
    storage.set(&ADMIN, &admin);
    Ok(())
}
