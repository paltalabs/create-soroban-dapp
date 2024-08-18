Paltalabs Challenge

# Paltalabs Challenge

Este proyecto forma parte del desafío Paltalabs, que se enfoca en añadir controles de autorización a un contrato inteligente para garantizar que solo direcciones específicas puedan modificar un título. Además, el proyecto incluye la implementación de la gestión de direcciones y el uso de `required_auth` para verificar que los cambios sean realizados por usuarios autorizados.

## Descripción

El objetivo del desafío es implementar un contrato inteligente con las siguientes funcionalidades:

- **Control de Autorización**: Permitir que solo direcciones autorizadas puedan modificar el título del contrato.
- **Gestión de Direcciones**: Habilitar la adición y eliminación de direcciones autorizadas (editores).
- **Manejo de Errores**: Definir y gestionar errores específicos relacionados con la autorización y la operación del contrato.

## Archivos

### `auth.rs`

Este archivo contiene dos `enum` cruciales para la gestión de errores y la autenticación dentro del contrato:

- **`AuthError`**: Enum que define diferentes errores que pueden ocurrir durante la autorización y operación del contrato.
- **`Key`**: Enum que especifica las claves utilizadas para almacenar datos en el contrato.

```rust
pub enum AuthError {
    Unauthorized = 1,
    Initialized = 2,
    AdminNotFound = 3,
    EditorAlreadyExists = 4,
    EditorNotFound = 5,
    OperationFailed = 6,
}

pub enum Key {
    Title,
    Admin,
    Editors,
}
```
Estas estructuras permiten manejar errores de manera efectiva y gestionar la autenticación de los usuarios.

lib.rs
En este archivo se implementan las funciones que utilizan las definiciones de auth.rs. Aquí se encuentran las operaciones principales del contrato, incluyendo la inicialización, configuración, lectura y gestión de títulos y editores.

test.rs
Este archivo incluye funciones de prueba diseñadas para verificar que el contrato funcione correctamente y cumpla con los requisitos del desafío. Las pruebas aseguran que todas las funcionalidades del contrato operen como se espera.

Instalación y Ejecución
Para configurar y probar el proyecto, sigue estos pasos:

Clona el repositorio (si aún no lo has hecho):

```bash

git clone <URL_DEL_REPOSITORIO>
cd soroban-react-dapp/
```
Inicia los servicios de Docker:

```bash
docker compose up -d
Accede al contenedor de Docker:
```
```bash

docker exec -it soroban-preview bash

```

Navega al directorio de contratos:
```bash

cd contracts
Compila el contrato:
```
```bash

make build
Ejecuta las pruebas:
```
```bash
Copiar código
make test
```


Falto

Implementacion en frontend
