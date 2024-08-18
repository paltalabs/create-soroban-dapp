#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_init_and_set_title() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Inicializar el contrato
    client.init(&admin);

    // Verificar el título por defecto
    let default_title = client.read_title();
    assert_eq!(default_title, String::from_str(&env, "Default Title"));

    // Establecer un nuevo título
    client.set_title(&admin, &String::from_str(&env, "New Title(Repollo1000)"));
    let new_title = client.read_title();
    assert_eq!(new_title, String::from_str(&env, "New Title(Repollo1000)"));
}

#[test]
fn test_add_and_remove_editor() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let editor = Address::generate(&env);

    client.init(&admin);

    // Añadir un editor
    client.add_editor(&admin, &editor);

    // Verificar que el editor puede establecer el título
    client.set_title(&editor, &String::from_str(&env, "Editor Title"));
    let editor_title = client.read_title();
    assert_eq!(editor_title, String::from_str(&env, "Editor Title"));

    // Remover el editor
    client.remove_editor(&admin, &editor);

    // Verificar que el editor ya no puede establecer el título
    let result = client.try_set_title(&editor, &String::from_str(&env, "Unauthorized Title"));
    assert!(result.is_err());
}

#[test]
fn test_unauthorized_set_title() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let unauthorized_user = Address::generate(&env);

    client.init(&admin);

    // Intentar establecer el título con un usuario no autorizado
    let result = client.try_set_title(&unauthorized_user, &String::from_str(&env, "Unauthorized Title"));
    assert!(result.is_err());
}

#[test]
fn test_search() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, TitleContract);
    let client = TitleContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let editor1 = Address::generate(&env);
    let editor2 = Address::generate(&env);

    client.init(&admin);
    client.add_editor(&admin, &editor1);
    client.add_editor(&admin, &editor2);

    let editors = client.search();
    assert_eq!(editors.len(), 3); // admin + 2 editors
    assert!(editors.contains(&admin));
    assert!(editors.contains(&editor1));
    assert!(editors.contains(&editor2));
}
