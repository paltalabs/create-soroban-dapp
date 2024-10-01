#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, testutils::Address as _};

    #[test]
    fn test_cv_operations() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CVContract);
        let client = CVContractClient::new(&env, &contract_id);

        let owner = Address::random(&env);

        client.create_cv(
            &owner,
            &String::from_str(&env, "George Oehrens"),
            &String::from_str(&env, "george@example.com"),
            &String::from_str(&env, "Rust, Soroban"),
            &String::from_str(&env, "5 years of development"),
            &String::from_str(&env, "Computer Science Degree"),
        );

        let cv = client.get_cv(&owner).unwrap();
        assert_eq!(cv.name, String::from_str(&env, "George Oehrens"));
        assert_eq!(cv.email, String::from_str(&env, "george@example.com"));

        client.update_cv(
            &owner,
            &Some(String::from_str(&env, "Jorge Oehrens")),
            &None,
            &Some(String::from_str(&env, "Rust, Soroban, Stellar")),
            &None,
            &None,
        );

        let updated_cv = client.get_cv(&owner).unwrap();
        assert_eq!(updated_cv.name, String::from_str(&env, "Jorge Oehrens"));
        assert_eq!(updated_cv.email, String::from_str(&env, "george@example.com"));
        assert_eq!(updated_cv.skills, String::from_str(&env, "Rust, Soroban, Stellar"));
    }

    #[test]
    fn test_multiple_initializations() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CVContract);
        let client = CVContractClient::new(&env, &contract_id);

        let owner1 = Address::random(&env);
        let owner2 = Address::random(&env);

        client.create_cv(
            &owner1,
            &String::from_str(&env, "George Oehrens"),
            &String::from_str(&env, "george.oehrens@example.com"),
            &String::from_str(&env, "Rust, Soroban"),
            &String::from_str(&env, "3 years of development"),
            &String::from_str(&env, "Computer Science Degree"),
        );

        client.create_cv(
            &owner2,
            &String::from_str(&env, "George Benavides"),
            &String::from_str(&env, "george.benavides@example.com"),
            &String::from_str(&env, "Java, Soroban"),
            &String::from_str(&env, "5 years of development"),
            &String::from_str(&env, "Software Engineering Degree"),
        );

        let cv1 = client.get_cv(&owner1).unwrap();
        let cv2 = client.get_cv(&owner2).unwrap();

        assert_eq!(cv1.name, String::from_str(&env, "George Oehrens"));
        assert_eq!(cv2.name, String::from_str(&env, "George Benavides"));
    }

    #[test]
    fn test_security_concerns() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CVContract);
        let client = CVContractClient::new(&env, &contract_id);

        let owner = Address::random(&env);
        let attacker = Address::random(&env);

        client.create_cv(
            &owner,
            &String::from_str(&env, "George Oehrens"),
            &String::from_str(&env, "george.oehrens@example.com"),
            &String::from_str(&env, "Rust, Soroban"),
            &String::from_str(&env, "3 years of development"),
            &String::from_str(&env, "Computer Science Degree"),
        );

        let result = client.update_cv(
            &attacker,
            &Some(String::from_str(&env, "Hacker")),
            &None,
            &None,
            &None,
            &None,
        );

        assert!(result.is_err());
    }

    #[test]
    fn test_error_handling() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CVContract);
        let client = CVContractClient::new(&env, &contract_id);

        let owner = Address::random(&env);

        let result = client.get_cv(&owner);
        assert!(result.is_err());

        let result = client.update_cv(
            &owner,
            &Some(String::from_str(&env, "George Oehrens")),
            &None,
            &None,
            &None,
            &None,
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_get_cv() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CVContract);
        let client = CVContractClient::new(&env, &contract_id);

        let owner = Address::random(&env);

        client.create_cv(
            &owner,
            &String::from_str(&env, "George Oehrens"),
            &String::from_str(&env, "george.oehrens@example.com"),
            &String::from_str(&env, "Rust, Soroban"),
            &String::from_str(&env, "3 years of development"),
            &String::from_str(&env, "Computer Science Degree"),
        );

        let cv = client.get_cv(&owner).unwrap();
        assert_eq!(cv.name, String::from_str(&env, "George Oehrens"));
        assert_eq!(cv.email, String::from_str(&env, "george.oehrens@example.com"));
        assert_eq!(cv.skills, String::from_str(&env, "Rust, Soroban"));
        assert_eq!(cv.experience, String::from_str(&env, "3 years of development"));
        assert_eq!(cv.education, String::from_str(&env, "Computer Science Degree"));
    }
}