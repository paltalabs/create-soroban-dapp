#![no_std]  // Ensures the code does not use the Rust standard library (important for embedded systems or environments with limited resources)
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short, String, Address};  // Import necessary modules from the Soroban SDK

// Define a constant for the storage key used to store the title
const TITLE: Symbol = symbol_short!("TITLE");

#[contract]
pub struct TitleContract;  // Define the contract structure

#[contractimpl]
impl TitleContract {

    // Function to set a new title, can only be called by an authorized address
    pub fn set_title(env: Env, title: String, caller: Address) {
        // Define an authorized address (replace this with the correct authorized wallet address)
        let my_string = String::from_str(&env, "GCNRGNKSM5B6VE4GSKMUOJCWXQ3B4HTSH3NZY23QCLT7M6ITIZAZSNJS");
        let authorized_address = Address::from_string(&my_string);

        // Check if the caller's address matches the authorized address
        if caller != authorized_address {
            panic!("Woo")  // If the caller is not authorized, trigger a panic with a message
        }
        // Store the new title in the contract's storage
        env.storage().instance().set(&TITLE, &title);
    }

    // Function to read the stored title
    pub fn read_title(env: Env) -> String {
        // Retrieve the title from storage, or return "Default Title" if not set
        env.storage().instance().get(&TITLE)
            .unwrap_or_else(|| String::from_str(&env, "Default Title"))
    }
}

mod test;  // Module for testing the contract (implementation not shown)