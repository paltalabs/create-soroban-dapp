#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
pub struct CV {
    owner: Address,
    name: String,
    email: String,
    skills: Vec<String>,
    experience: Vec<String>,
    education: Vec<String>,
}

#[contract]
pub struct CVContract;

#[contractimpl]
impl CVContract {
    pub fn init(env: Env, owner: Address) {
        env.storage().instance().set(&owner, &CV {
            owner: owner.clone(),
            name: String::from_str(&env, ""),
            email: String::from_str(&env, ""),
            skills: Vec::new(&env),
            experience: Vec::new(&env),
            education: Vec::new(&env),
        });
    }

    pub fn update_cv(env: Env, owner: Address, name: String, email: String) {
        owner.require_auth();
        let mut cv = env.storage().instance().get::<Address, CV>(&owner).unwrap();
        cv.name = name;
        cv.email = email;
        env.storage().instance().set(&owner, &cv);
    }

    pub fn add_skill(env: Env, owner: Address, skill: String) {
        owner.require_auth();
        let mut cv = env.storage().instance().get::<Address, CV>(&owner).unwrap();
        cv.skills.push_back(skill);
        env.storage().instance().set(&owner, &cv);
    }

    pub fn add_experience(env: Env, owner: Address, experience: String) {
        owner.require_auth();
        let mut cv = env.storage().instance().get::<Address, CV>(&owner).unwrap();
        cv.experience.push_back(experience);
        env.storage().instance().set(&owner, &cv);
    }

    pub fn add_education(env: Env, owner: Address, education: String) {
        owner.require_auth();
        let mut cv = env.storage().instance().get::<Address, CV>(&owner).unwrap();
        cv.education.push_back(education);
        env.storage().instance().set(&owner, &cv);
    }

    pub fn get_cv(env: Env, owner: Address) -> CV {
        env.storage().instance().get(&owner).unwrap()
    }
}