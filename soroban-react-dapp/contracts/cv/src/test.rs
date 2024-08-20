#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_cv_contract() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CVContract);
    let client = CVContractClient::new(&env, &contract_id);

    // Test initialization
    let owner = Address::random(&env);
    client.init(&owner);

    // Test updating CV
    let name = String::from_str(&env, "Jorge Oehrens");
    let email = String::from_str(&env, "jorge.oehrens@gmail.com");
    client.update_cv(&owner, &name, &email);

    // Test adding skills
    let skill1 = String::from_str(&env, "Rust");
    let skill2 = String::from_str(&env, "Soroban");
    client.add_skill(&owner, &skill1);
    client.add_skill(&owner, &skill2);

    // Test adding experience
    let experience1 = String::from_str(&env, "Full Stack Developer at Canasta Ahorro");
    let experience2 = String::from_str(&env, "Blockchain Developer at Stellar");
    client.add_experience(&owner, &experience1);
    client.add_experience(&owner, &experience2);

    // Test adding education
    let education1 = String::from_str(&env, "Civil Engineering");
    let education2 = String::from_str(&env, "Blockchain Development Certification");
    client.add_education(&owner, &education1);
    client.add_education(&owner, &education2);

    // Test getting CV
    let cv = client.get_cv(&owner);
    assert_eq!(cv.owner, owner);
    assert_eq!(cv.name, name);
    assert_eq!(cv.email, email);
    assert_eq!(cv.skills, Vec::from_array(&env, [skill1, skill2]));
    assert_eq!(cv.experience, Vec::from_array(&env, [experience1, experience2]));
    assert_eq!(cv.education, Vec::from_array(&env, [education1, education2]));
}