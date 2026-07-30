# Registro de Barcos Históricos

## Nombre del estudiante
_(Completa aquí tu nombre)_

## Descripción
Aplicación web full stack que permite a cada usuario registrado administrar su propio
catálogo de embarcaciones históricas: país de origen, época, tipo, función principal,
hechos relevantes y estado actual. Incluye autenticación con JWT, cifrado de contraseñas
y un CRUD completo protegido por token.

## Tecnologías utilizadas
**Backend:** Node.js, Express, MongoDB (local), Mongoose, JSON Web Token, bcryptjs, dotenv, cors.
**Frontend:** HTML5, CSS3, JavaScript clásico, Fetch API, Local Storage.

## Requisitos previos
- Node.js instalado (v18 o superior recomendado).
- MongoDB Community Server instalado y corriendo localmente.

## Instalación

1. Clonar o descomprimir el proyecto y entrar a la carpeta:
   ```bash
   cd proyecto
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear el archivo `.env` a partir de `.env.example` y completar los valores:
   ```bash
   cp .env.example .env
   ```
   Contenido de referencia:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/barcosHistoricosDB
   JWT_SECRET=un_secreto_largo_y_seguro
   JWT_EXPIRES_IN=1d
   ```

## Pasos para iniciar MongoDB local
Ver instrucciones detalladas más abajo en la sección "Instrucciones de instalación de MongoDB".
En resumen, con MongoDB instalado como servicio, este ya corre automáticamente en:
```
mongodb://127.0.0.1:27017
```
Si no corre como servicio, iniciarlo manualmente con:
```bash
mongod --dbpath "C:\data\db"
```
(o la ruta configurada según el sistema operativo).

## Pasos para ejecutar el servidor
```bash
npm start
```
o en modo desarrollo con reinicio automático:
```bash
npm run dev
```

## Dirección de acceso
```
http://localhost:3000
```
La aplicación redirige automáticamente a `login.html` si no hay sesión iniciada.

## Rutas de la API

### Autenticación
| Método | Ruta                  | Descripción                      | Protegida |
|--------|-----------------------|-----------------------------------|-----------|
| POST   | /api/auth/registro    | Registra un nuevo usuario         | No        |
| POST   | /api/auth/login       | Inicia sesión y devuelve el token | No        |
| GET    | /api/auth/perfil      | Obtiene los datos del usuario     | Sí        |

### CRUD de barcos históricos
| Método | Ruta              | Descripción                          | Protegida |
|--------|-------------------|----------------------------------------|-----------|
| GET    | /api/barcos       | Lista los barcos del usuario autenticado | Sí      |
| GET    | /api/barcos/:id   | Consulta un barco por su id             | Sí      |
| POST   | /api/barcos       | Crea un nuevo barco                     | Sí      |
| PUT    | /api/barcos/:id   | Actualiza un barco existente            | Sí      |
| DELETE | /api/barcos/:id   | Elimina un barco                        | Sí      |

Las rutas protegidas requieren el encabezado:
```
Authorization: Bearer TOKEN
```

## Credenciales de prueba
_(Completar luego de crear un usuario de prueba, por ejemplo:)_
- Correo: prueba@correo.com
- Contraseña: 123456

## Capturas del sistema
_(Agregar aquí las capturas del sistema funcionando: registro, login, CRUD, etc.)_
