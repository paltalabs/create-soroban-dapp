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
    let skill = String::from_str(&env, "Rust");
    client.add_skill(&owner, &skill);

    // Test adding experience
    let experience = String::from_str(&env, "Full Stack Developer Canasta Ahorro");
    client.add_experience(&owner, &experience);

    // Test adding education
    let education = String::from_str(&env, "Civil Engineering");
    client.add_education(&owner, &education);

    // Test getting CV
    let cv = client.get_cv(&owner);
    assert_eq!(cv.owner, owner);
    assert_eq!(cv.name, name);
    assert_eq!(cv.email, email);
    assert_eq!(cv.skills, Vec::from_array(&env, [skill]));
    assert_eq!(cv.experience, Vec::from_array(&env, [experience]));
    assert_eq!(cv.education, Vec::from_array(&env, [education]));
}
