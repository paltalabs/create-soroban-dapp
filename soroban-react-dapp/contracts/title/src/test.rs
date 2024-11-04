#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, MockAuth, MockAuthInvoke}, Address, Env, String, IntoVal, Vec, Val};

#[test]
fn test_set_admin() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    // Crear un usuario virtual para el admin
    let admin = Address::generate(&env);

    // Autenticar y setear al admin
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "set_admin",
            args: (&admin,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .set_admin(&admin);

    // Obtener el admin
    assert_eq!(client.address_admin(), admin);


}

#[test]
fn test_add_user_and_get_users() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    // Crear usuarios virtuales para el admin y el usuario
    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Autenticar y setear al admin
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "set_admin",
            args: (&admin,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .set_admin(&admin);

    // Autenticar y agregar al usuario
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_user",
            args: (&user,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .add_user(&user);

    // Verificar que el usuario aparece en la lista de usuarios autorizados
    let users = client.get_users();
    assert!(users.contains(&user));
}

#[test]
fn test_modify_title() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    // Crear usuarios virtuales para el admin y el usuario
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let new_title = String::from_str(&env, "PrincesitoDan");

    // Autenticar y setear al admin
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "set_admin",
            args: (&admin,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .set_admin(&admin);

    // Autenticar y agregar al usuario
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_user",
            args: (&user,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .add_user(&user);

      // Crear un Vec<Val> a partir de un array
      let args: Vec<Val> = Vec::from_array(&env, [
        user.into_val(&env), 
        new_title.clone().into_val(&env)
    ]);

    // Autenticar al usuario y modificar el título
    let result = client
        .mock_auths(&[MockAuth {
            address: &user,
            invoke: &MockAuthInvoke {
                contract: &contract_id,
                fn_name: "modify_title",
                args: args.into_val(&env), // Usar el vector como argumento
                sub_invokes: &[],
            },
        }])
        .modify_title(&user, &new_title);

    // Verificar que el título fue modificado
    assert_eq!(client.get_title(), new_title);
}

#[test]
fn test_modify_admin() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    // Crear usuarios virtuales para el admin y el nuevo admin
    let admin = Address::generate(&env);
    let new_admin = Address::generate(&env);

    // Autenticar y setear al admin
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "set_admin",
            args: (&admin,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .set_admin(&admin);

    // Autenticar al admin actual y modificar al nuevo admin
    client.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "modify_admin",
            args: (&new_admin,).into_val(&env),
            sub_invokes: &[],
        },
    }])
    .modify_admin(&new_admin);

    // Verificar que solo el nuevo admin tiene los permisos necesarios
    assert_eq!(client.address_admin(), new_admin);
}

