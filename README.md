# API de Productos con Node.js

Este proyecto es una API básica para manejar productos, utilizando Node.js. Permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) en productos mediante peticiones HTTP. El servidor también sirve archivos estáticos como HTML, CSS y JS.

## Requisitos

- Node.js
- npm

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/CAMCDI/API.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd practica API
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

1. Asegúrate de tener configurado el archivo `config.js` con las variables de entorno adecuadas, como `PORT` y `SECRET_TOKEN`.
   
   **Ejemplo de config.js**:
   ```js
   module.exports = {
     PORT: 3000,
     SECRET_TOKEN: 'tu_token_secreto'
   };
   ```

2. Inicia el servidor:
   ```bash
   node index.js
   ```

   El servidor estará corriendo en `http://localhost:3000`.

## Endpoints

### 1. Obtener todos los productos

**Método:** `GET`  
**Ruta:** `/api/products`

Obtiene una lista de todos los productos.

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Producto 1",
    "price": 100
  },
  {
    "id": 2,
    "name": "Producto 2",
    "price": 200
  }
]
```

### 2. Crear un nuevo producto

**Método:** `POST`  
**Ruta:** `/api/products`

Crea un nuevo producto. Debes proporcionar un token válido en el encabezado de la solicitud para autenticación.

**Cuerpo de la solicitud:**
```json
{
  "name": "Producto 3",
  "price": 300
}
```

**Respuesta (201 Created):**
```json
{
  "id": 3,
  "name": "Producto 3",
  "price": 300
}
```

### 3. Actualizar un producto

**Método:** `PUT`  
**Ruta:** `/api/products/{id}`

Actualiza un producto existente. Debes proporcionar un token válido en el encabezado de la solicitud para autenticación.

**Cuerpo de la solicitud:**
```json
{
  "name": "Producto 3 actualizado",
  "price": 350
}
```

**Respuesta (200 OK):**
```json
{
  "id": 3,
  "name": "Producto 3 actualizado",
  "price": 350
}
```

### 4. Eliminar un producto

**Método:** `DELETE`  
**Ruta:** `/api/products/{id}`

Elimina un producto. Debes proporcionar un token válido en el encabezado de la solicitud para autenticación.

**Respuesta (200 OK):**
```json
{
  "message": "Producto eliminado",
  "deletedProduct": {
    "id": 3,
    "name": "Producto 3",
    "price": 300
  }
}
```

### 5. Archivos Estáticos

El servidor también sirve archivos estáticos como HTML, CSS y JS.

- La ruta raíz (`/`) sirve el archivo `index.html` desde el directorio `./public`.
- Los archivos estáticos (CSS, JS) se sirven desde la ruta `/static/{archivo}`.

## Middleware

### Autenticación

El servidor utiliza un middleware de autenticación que valida un token de acceso en el encabezado `Authorization`. Si el token es incorrecto o no está presente, se devuelve un error 403.

### Manejo de Errores

El servidor tiene una función de manejo de errores que responde con un código de estado y un mensaje de error adecuado en formato JSON.

### Función de Registro

Se registra cada solicitud realizada al servidor usando la función `logEvent`, que escribe los detalles en un archivo de registro.

## Contribución

Si deseas contribuir, por favor crea un fork de este repositorio, realiza tus cambios y envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.
