# TaskFlow API

API REST para la gestión de tareas, construida con Express 5 + TypeScript + PostgreSQL + Prisma.

## Stack tecnológico

- **Node.js** — Entorno de ejecución
- **Express 5** — Framework web
- **TypeScript 6.0** — Lenguaje con tipado estático
- **PostgreSQL + Prisma** — Base de datos relacional y ORM
- **Swagger** — Documentación interactiva de la API
- **JWT + bcrypt** — Autenticación y hash de contraseñas
- **Zod** — Validación de datos de entrada
- **ts-node-dev** — Recarga automática en desarrollo

## Requisitos previos

- Node.js >= 18
- PostgreSQL corriendo localmente

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd taskflow-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Ejecutar migraciones de Prisma
npx prisma migrate dev

# 5. Iniciar en modo desarrollo
npm run dev
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | — |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | — |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor con recarga automática |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta la compilación producida |

## Estructura del proyecto

```
taskflow-api/
├── prisma/
│   └── schema.prisma              # Modelos de base de datos
├── src/
│   ├── index.ts                   # Punto de entrada, middlewares globales, rutas
│   ├── config/
│   │   ├── database.ts            # Pool de conexión a PostgreSQL (pg)
│   │   ├── prisma.ts              # Instancia singleton de PrismaClient
│   │   └── swagger.ts             # Configuración de Swagger/OpenAPI
│   ├── constants/
│   │   ├── error.codes.ts         # Códigos de error internos
│   │   └── messages.code.ts       # Mensajes del sistema
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Verificación de JWT global
│   │   └── validate.middleware.ts # Validación con esquemas Zod
│   ├── routes/
│   │   ├── health.ts              # GET /health
│   │   ├── users.ts               # CRUD /api/users
│   │   ├── projects.ts            # CRUD /api/projects
│   │   ├── tasks.ts               # CRUD /api/tasks
│   │   ├── auth.ts                # Auth /api/auth
│   │   └── comments.ts            # CRUD /api/comments
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── projects.controller.ts
│   │   ├── tasks.controller.ts
│   │   ├── auth.controller.ts
│   │   └── comments.controller.ts
│   ├── services/
│   │   ├── users.service.ts
│   │   ├── projects.service.ts
│   │   ├── tasks.service.ts
│   │   ├── auth.service.ts
│   │   └── comments.service.ts
│   ├── schema/
│   │   ├── auth.schemas.ts        # Esquemas Zod para auth
│   │   └── task.schemas.ts        # Esquemas Zod para tareas
│   ├── types/
│   │   ├── users.types.ts
│   │   ├── projects.types.ts
│   │   ├── task.types.ts
│   │   ├── auth.types.ts
│   │   └── comment.types.ts
│   └── utils/
│       └── api-response.ts        # Helper estandarizado de respuestas
├── dist/                          # Compilación (gitignorado)
├── .env                           # Variables de entorno (gitignorado)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── AGENTS.md                      # Guía para agentes de IA
├── package.json
├── tsconfig.json
└── README.md
```

## Autenticación

Todas las rutas bajo `/api` están protegidas por autenticación JWT, excepto `POST /api/auth/register` y `POST /api/auth/login`.

Para consumir los endpoints protegidos, incluir el header:

```
Authorization: Bearer <token>
```

El token se obtiene mediante `POST /api/auth/register` o `POST /api/auth/login`.

## Formato de respuesta estandarizado

Todas las respuestas siguen la misma estructura:

```json
{
  "status": 200,
  "message": "Operación exitosa",
  "data": { },
  "error": "INVALID_TOKEN",
  "timestamp": "2026-07-01T00:00:00.000Z"
}
```

## Documentación interactiva

La API cuenta con documentación Swagger en `/api-docs`. Allí se pueden probar todos los endpoints, incluidos los protegidos usando el botón **Authorize** para ingresar el token JWT.

## Endpoints

### `GET /`

Información general de la API.

### `GET /health`

Verifica que el servidor y la conexión a PostgreSQL estén funcionando.

### Auth — `/api/auth`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registrar un nuevo usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/me` | Sí | Obtener el usuario autenticado |

**POST /api/auth/register**

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Respuesta (201):**
```json
{
  "token": "jwt-token",
  "user": { "id": "uuid", "name": "string", "email": "string" }
}
```

**POST /api/auth/login**

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Respuesta (200):**
```json
{
  "token": "jwt-token",
  "user": { "id": "uuid", "name": "string", "email": "string" }
}
```

### Usuarios — `/api/users`

Todos los endpoints requieren autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listar todos los usuarios |
| GET | `/api/users/:id` | Obtener un usuario por ID |
| POST | `/api/users` | Crear un nuevo usuario |
| PUT | `/api/users/:id` | Actualizar un usuario |
| DELETE | `/api/users/:id` | Eliminar un usuario |

### Proyectos — `/api/projects`

Todos los endpoints requieren autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | Listar todos los proyectos |
| GET | `/api/projects/:id` | Obtener un proyecto por ID |
| POST | `/api/projects` | Crear un nuevo proyecto |
| PUT | `/api/projects/:id` | Actualizar un proyecto |
| DELETE | `/api/projects/:id` | Eliminar un proyecto |

### Tareas — `/api/tasks`

Todos los endpoints requieren autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tasks/project/:projectId` | Listar tareas de un proyecto (filtro opcional `?status=TODO`) |
| GET | `/api/tasks/:id` | Obtener una tarea por ID |
| POST | `/api/tasks` | Crear una nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

### Comentarios — `/api/comments`

Todos los endpoints requieren autenticación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/comments/task/:taskId` | Listar comentarios de una tarea |
| POST | `/api/comments` | Crear un comentario |
| DELETE | `/api/comments/:id` | Eliminar un comentario |

## Modelo de datos

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  CANCELLED
}

model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  projects     Project[]
  tasks        Task[]
  comments     Comment[]
}

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime  @default(now())
  owner       User      @relation(fields: [ownerId], references: [id])
  tasks       Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  projectId   String
  assignedTo  String?
  createdAt   DateTime   @default(now())
  project     Project    @relation(fields: [projectId], references: [id])
  assignee    User?
  comments    Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  taskId    String
  userId    String
  createdAt DateTime @default(now())
  task      Task     @relation(fields: [taskId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

## Lo que se ha implementado

- [x] Configuración inicial del proyecto con TypeScript
- [x] Servidor Express 5 con middlewares globales (CORS, JSON, URL-encoded)
- [x] Pool de conexión a PostgreSQL
- [x] Prisma ORM con migraciones
- [x] Endpoint `GET /health` con verificación de base de datos
- [x] Endpoint `GET /` con información de la API
- [x] Documentación Swagger en `/api-docs`
- [x] Formato de respuesta estandarizado (`ApiResponse`)
- [x] Validación de datos con Zod
- [x] CRUD de usuarios (`/api/users`)
- [x] CRUD de proyectos (`/api/projects`)
- [x] CRUD de tareas (`/api/tasks`)
- [x] Autenticación JWT (register, login, middleware global)
- [x] CRUD de comentarios (`/api/comments`)
- [ ] CRUD de tareas con filtros avanzados (pendiente)
- [ ] Roles y permisos (pendiente)
