# Documentación de la API - Ruta Bici-Maya

Este documento detalla los endpoints y la configuración de la API del proyecto.

---

## 1. Configuración Inicial

Para levantar el proyecto, se realizaron los siguientes cambios:

1.  **Instalación de Dependencias:** Se añadieron los paquetes necesarios para la autenticación y la conexión a la base de datos MySQL.
    ```bash
    npm install express sequelize mysql2 jsonwebtoken bcryptjs dotenv cors
    ```
2.  **Estructura de Archivos:** Se crearon los siguientes archivos y directorios:
    -   `src/config/database.js`: Contiene la configuración y conexión de Sequelize a la base de datos.
    -   `src/models/`: Contiene los modelos de datos para `User`, `Route`, `Store`, y `Transaction`.
    -   `src/controllers/`: Contiene la lógica de negocio para la autenticación, administración y el resto de entidades.
    -   `src/routes/`: Define las rutas para todos los módulos.
    -   `src/middlewares/`: Contiene los middlewares de autenticación (`auth` y `authAdmin`).
3.  **Actualización de `server.js`:** Se modificó el archivo principal para incluir la conexión a la base de datos, middlewares y todas las rutas de la API.

---

## 2. Módulo de Autenticación

Endpoints para la gestión de cuentas de usuario.

### Registrar un nuevo usuario

-   **Método:** `POST`
-   **URL:** `/api/auth/register`
-   **Acceso:** Público
-   **Body:**
    ```json
    {
      "nombre": "Nombre del Usuario",
      "email": "usuario@ejemplo.com",
      "password": "una_contraseña_segura",
      "rol": "Ciclista" // 'Ciclista', 'Comerciante', o 'Creador de Ruta'
    }
    ```
-   **Respuesta Exitosa (201_OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### Iniciar sesión

-   **Método:** `POST`
-   **URL:** `/api/auth/login`
-   **Acceso:** Público
-   **Body:**
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "una_contraseña_segura"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

## 3. Módulo de Perfil de Usuario

Endpoints para que los usuarios gestionen su propia información.

### Obtener mi perfil

-   **Método:** `GET`
-   **URL:** `/api/users/me`
-   **Acceso:** Privado (Cualquier usuario autenticado)
-   **Headers:** `x-auth-token: <tu_jwt>`
-   **Respuesta Exitosa (200 OK):** Devuelve el objeto del usuario sin la contraseña.

### Actualizar mi perfil

-   **Método:** `PUT`
-   **URL:** `/api/users/me`
-   **Acceso:** Privado (Cualquier usuario autenticado)
-   **Headers:** `x-auth-token: <tu_jwt>`
-   **Body:**
    ```json
    {
      "nombre": "Nuevo Nombre",
      "email": "nuevo_email@ejemplo.com"
    }
    ```
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Profile updated successfully"
    }
    ```

---

## 4. Módulo de Rutas (Público y Creadores)

Endpoints para interactuar con las rutas.

### Obtener todas las rutas aprobadas

-   **Método:** `GET`
-   **URL:** `/api/routes`
-   **Acceso:** Público
-   **Respuesta Exitosa (200 OK):** Devuelve un array de rutas con estado 'aprobada'.

### Obtener una ruta por ID

-   **Método:** `GET`
-   **URL:** `/api/routes/:id`
-   **Acceso:** Público
-   **Respuesta Exitosa (200 OK):** Devuelve una única ruta si está 'aprobada'.

### Crear una nueva ruta

-   **Método:** `POST`
-   **URL:** `/api/routes`
-   **Acceso:** Privado (Solo 'Creador de Ruta')
-   **Headers:** `x-auth-token: <tu_jwt_creador>`
-   **Body:**
    ```json
    {
      "nombre": "Mi Nueva Ruta",
      "descripcion": "Descripción de la ruta.",
      "distancia": 15.5,
      "dificultad": "Intermedia",
      "precio": 5.00
    }
    ```
-   **Respuesta Exitosa (201 Created):** Devuelve el objeto de la nueva ruta con estado 'pendiente'.

### Actualizar una de mis rutas

-   **Método:** `PUT`
-   **URL:** `/api/routes/:id`
-   **Acceso:** Privado (Solo 'Creador de Ruta' sobre sus propias rutas)
-   **Headers:** `x-auth-token: <tu_jwt_creador>`
-   **Body:** Campos a actualizar.
-   **Respuesta Exitosa (200 OK):** Devuelve el objeto de la ruta actualizada.

### Eliminar una de mis rutas

-   **Método:** `DELETE`
-   **URL:** `/api/routes/:id`
-   **Acceso:** Privado (Solo 'Creador de Ruta' sobre sus propias rutas)
-   **Headers:** `x-auth-token: <tu_jwt_creador>`
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Route removed"
    }
    ```

---

## 5. Módulo de Comercios (Público y Comerciantes)

Endpoints para interactuar con los comercios.

### Obtener todos los comercios activos

-   **Método:** `GET`
-   **URL:** `/api/stores`
-   **Acceso:** Público
-   **Respuesta Exitosa (200 OK):** Devuelve un array de comercios con estado 'activo'.

### Obtener un comercio por ID

-   **Método:** `GET`
-   **URL:** `/api/stores/:id`
-   **Acceso:** Público
-   **Respuesta Exitosa (200 OK):** Devuelve un único comercio si está 'activo'.

### Crear un nuevo comercio

-   **Método:** `POST`
-   **URL:** `/api/stores`
-   **Acceso:** Privado (Solo 'Comerciante')
-   **Headers:** `x-auth-token: <tu_jwt_comerciante>`
-   **Body:**
    ```json
    {
      "nombre": "Mi Tienda",
      "descripcion": "Descripción de mi tienda.",
      "ubicacion": "Dirección de la tienda"
    }
    ```
-   **Respuesta Exitosa (201 Created):** Devuelve el objeto del nuevo comercio con estado 'pendiente'.

### Actualizar mi comercio

-   **Método:** `PUT`
-   **URL:** `/api/stores/:id`
-   **Acceso:** Privado (Solo 'Comerciante' sobre su propio comercio)
-   **Headers:** `x-auth-token: <tu_jwt_comerciante>`
-   **Body:** Campos a actualizar.
-   **Respuesta Exitosa (200 OK):** Devuelve el objeto del comercio actualizado.

### Eliminar mi comercio

-   **Método:** `DELETE`
-   **URL:** `/api/stores/:id`
-   **Acceso:** Privado (Solo 'Comerciante' sobre su propio comercio)
-   **Headers:** `x-auth-token: <tu_jwt_comerciante>`
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "msg": "Store removed"
    }
    ```

---

## 6. Módulo de Transacciones

Endpoints para la gestión de transacciones de los usuarios.

### Obtener mis transacciones

-   **Método:** `GET`
-   **URL:** `/api/transactions/my-transactions`
-   **Acceso:** Privado (Cualquier usuario autenticado)
-   **Headers:** `x-auth-token: <tu_jwt>`
-   **Respuesta Exitosa (200 OK):** Devuelve un array de las transacciones del usuario.

### Crear una nueva transacción

-   **Método:** `POST`
-   **URL:** `/api/transactions`
-   **Acceso:** Privado (Cualquier usuario autenticado)
-   **Headers:** `x-auth-token: <tu_jwt>`
-   **Body:**
    ```json
    {
      "monto": 10.00,
      "tipo": "compra_ruta",
      "rutaId": 1
    }
    ```
-   **Respuesta Exitosa (201 Created):** Devuelve el objeto de la nueva transacción.

---

## 7. Módulo de Administración

Endpoints para la gestión y monitoreo de la plataforma. Requieren un rol de `Admin`.

### Obtener estadísticas del Dashboard

-   **Método:** `GET`
-   **URL:** `/api/admin/dashboard`
-   **Acceso:** Privado (Solo `Admin`)
-   **Headers:** `x-auth-token: <tu_jwt_de_admin>`
-   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "totalUsers": 150,
      "totalRoutes": 45,
      "activeStores": 23,
      "totalSales": 1250.75
    }
    ```

### Gestión de Usuarios (CRUD Completo)

-   `GET /api/admin/users`: Obtener todos los usuarios.
-   `GET /api/admin/users/:id`: Obtener un usuario por ID.
-   `POST /api/admin/users`: Crear un usuario.
-   `PUT /api/admin/users/:id`: Actualizar un usuario.
-   `DELETE /api/admin/users/:id`: Eliminar un usuario.

### Gestión de Rutas (CRUD Completo)

-   `GET /api/admin/routes`: Obtener todas las rutas.
-   `GET /api/admin/routes/:id`: Obtener una ruta por ID.
-   `POST /api/admin/routes`: Crear una ruta (aprobada por defecto).
-   `PUT /api/admin/routes/:id`: Actualizar cualquier campo de una ruta.
-   `PUT /api/admin/routes/:id/status`: Actualizar solo el estado de una ruta.
-   `DELETE /api/admin/routes/:id`: Eliminar una ruta.

### Gestión de Comercios (CRUD Completo)

-   `GET /api/admin/stores`: Obtener todos los comercios.
-   `GET /api/admin/stores/:id`: Obtener un comercio por ID.
-   `POST /api/admin/stores`: Crear un comercio (activo por defecto).
-   `PUT /api/admin/stores/:id`: Actualizar cualquier campo de un comercio.
-   `PUT /api/admin/stores/:id/status`: Actualizar solo el estado de un comercio.
-   `DELETE /api/admin/stores/:id`: Eliminar un comercio.

### Gestión de Transacciones

-   `GET /api/admin/transactions`: Obtener todas las transacciones.
-   `GET /api/admin/transactions/:id`: Obtener una transacción por ID.
