#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
pub struct CV {
    owner: Address,
    name: String,
    email: String,
    skills: String,
    experience: String,
    education: String,
}

#[contract]
pub struct CVContract;

#[contractimpl]
impl CVContract {
    pub fn create_cv(
        env: Env,
        owner: Address,
        name: String,
        email: String,
        skills: String,
        experience: String,
        education: String,
    ) {
        env.storage().instance().set(&owner, &CV {
            owner: owner.clone(),
            name,
            email,
            skills,
            experience,
            education,
        });
    }

    pub fn update_cv(
        env: Env,
        owner: Address,
        name: Option<String>,
        email: Option<String>,
        skills: Option<String>,
        experience: Option<String>,
        education: Option<String>,
    ) {
        owner.require_auth();

        let mut cv = env.storage().instance().get::<Address, CV>(&owner)
            .unwrap_or(CV {
                owner: owner.clone(),
                name: String::from_str(&env, ""),
                email: String::from_str(&env, ""),
                skills:String::from_str(&env, ""),
                experience: String::from_str(&env, ""),
                education: String::from_str(&env, ""),
            });

        if let Some(n) = name {
            cv.name = n;
        }

        if let Some(e) = email {
            cv.email = e;
        }

        if let Some(s) = skills {
            cv.skills = s;
        }

        if let Some(exp) = experience {
            cv.experience = exp;
        }

        if let Some(edu) = education {
            cv.education = edu;
        }

        env.storage().instance().set(&owner, &cv);
    }

    pub fn get_cv(env: Env, owner: Address) -> Option<CV> {
        env.storage().instance().get::<Address, CV>(&owner)

    }
}

mod test;
