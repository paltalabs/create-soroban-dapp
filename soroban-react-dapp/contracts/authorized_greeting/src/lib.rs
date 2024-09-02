#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address, Map};

const GREET: Symbol = symbol_short!("GREET");
const AUTH_GRTRS: Symbol = symbol_short!("AUTH_GTRS");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[derive(Debug)]
pub enum ContractError {
    AdminNotSet = 100,
    Unauthorized = 200,
    GreeterNotAuthorized = 201,
}

impl From<soroban_sdk::Error> for ContractError {
    fn from(_error: soroban_sdk::Error) -> Self {
        ContractError::Unauthorized
    }
}

impl From<&ContractError> for soroban_sdk::Error {
    fn from(error: &ContractError) -> soroban_sdk::Error {
        let code = match error {
            ContractError::AdminNotSet => soroban_sdk::xdr::ScErrorCode::MissingValue,
            ContractError::Unauthorized => soroban_sdk::xdr::ScErrorCode::InternalError,
            ContractError::GreeterNotAuthorized => soroban_sdk::xdr::ScErrorCode::InvalidInput,
        };
        soroban_sdk::Error::from_type_and_code(soroban_sdk::xdr::ScErrorType::Contract, code)
    }
}

#[contract]
pub struct AuthorizedGreetingContract;

#[contractimpl]
impl AuthorizedGreetingContract {
    pub fn set_admin(env: Env, admin: Address) {
        match env.storage().instance().get::<Symbol, Address>(&ADMIN) {
            Some(current_admin) => {
                current_admin.require_auth();
            }
            None => {}
        }
        env.storage().instance().set(&ADMIN, &admin);
    }

    pub fn get_admin(env: &Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get::<Symbol, Address>(&ADMIN)
            .ok_or(ContractError::AdminNotSet)
    }

    pub fn add_greeter(env: Env, greeter: Address) -> Result<(), ContractError> {
        let admin = Self::get_admin(&env)?; // Use `?` to propagate the error if any
        admin.require_auth();

        let mut authorized_greeter_list = Self::get_authorized_greeter_list(&env);
        authorized_greeter_list.set(greeter, true);
        env.storage().instance().set(&AUTH_GRTRS, &authorized_greeter_list);
        Ok(())
    }

    pub fn get_authorized_greeter_list(env: &Env) -> Map<Address, bool> {
        env.storage().instance().get(&AUTH_GRTRS).unwrap_or(Map::new(env))
    }

    pub fn set_greet(env: Env, greeter: Address, greet: String) -> Result<(), ContractError> {
        greeter.require_auth();

        let authorized_greeter_list = Self::get_authorized_greeter_list(&env);
        let greeter_is_authorized = authorized_greeter_list.get(greeter.clone()).unwrap_or(false);

        if greeter_is_authorized {
            env.storage().instance().set(&GREET, &greet);
            Ok(())
        } else {
            Err(ContractError::GreeterNotAuthorized)
        }
    }

    pub fn read_greet(env: Env) -> String {
        env.storage().instance().get(&GREET).unwrap_or(String::from_str(&env, ""))
    }
}

mod test;
