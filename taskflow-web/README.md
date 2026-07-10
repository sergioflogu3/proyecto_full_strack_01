# TaskFlow Web

Aplicación web de gestión de tareas con autenticación JWT, desarrollada con React + TypeScript + Vite + Tailwind CSS v4.

## Stack

| Tecnología      | Versión |
|-----------------|---------|
| React           | 19      |
| TypeScript      | 6       |
| Vite            | 8       |
| Tailwind CSS    | 4       |
| React Router    | 7       |
| Axios           | 1       |

## Requisitos

- Node.js >= 20
- npm >= 10

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Variables de entorno

| Variable            | Valor por defecto            | Descripción                         |
|---------------------|------------------------------|-------------------------------------|
| `VITE_API_URL`      | `http://localhost:3001`       | URL base del backend (sin `/api`)   |

## Arquitectura

```
src/
├── api/
│   ├── axios.ts              # Instancia de Axios con interceptores
│   └── auth.service.ts        # Servicio de autenticación
├── components/
│   └── ProtectedRoute.tsx     # Ruta protegida (redirige a /login si no autenticado)
├── context/
│   └── AuthContext.tsx         # Contexto de autenticación (login, logout, user, token)
├── pages/
│   ├── LoginPage.tsx          # Página de inicio de sesión
│   ├── RegisterPage.tsx       # Página de registro
│   └── DashboardPage.tsx      # Dashboard protegido
├── types/
│   └── index.ts               # Tipos compartidos (User, ApiResponse, etc.)
├── App.tsx                    # Router principal
├── App.css
├── index.css                  # Entrypoint de Tailwind
└── main.tsx                   # Punto de entrada
```

## Funcionalidades

### Autenticación

- **Login** (`POST /api/auth/login`): autenticación con email y contraseña, devuelve token JWT y datos del usuario.
- **Registro** (`POST /api/auth/register`): creación de cuenta con name, email y password.
- **Persistencia de sesión**: el token y usuario se guardan en `localStorage` y se restauran al recargar la página.
- **Interceptor 401**: si el backend responde con 401, se limpia la sesión automáticamente y se redirige a `/login`.

### Rutas

| Ruta          | Acceso     | Componente       |
|---------------|------------|------------------|
| `/login`      | Público    | `LoginPage`      |
| `/register`   | Público    | `RegisterPage`   |
| `/dashboard`  | Protegido  | `DashboardPage`  |
| `/`           | Redirige a `/dashboard` | |
| `*`           | Redirige a `/login`     | |

### Tipos principales (`src/types/index.ts`)

```ts
ApiResponse<T>   // Envoltorio de respuestas del backend: status, message, data, timestamp
AuthPayload       // { token, user }
User              // { id, name, email }
LoginCredentials  // { email, password }
RegisterData      // { name, email, password }
```

### Variables de entorno del backend esperado

El backend debe exponer:

- `POST /api/auth/login` — body: `{ email, password }` → response: `{ status: 200, message, data: { token, user }, timestamp }`
- `POST /api/auth/register` — body: `{ name, email, password }` → response: `{ status: 200, message, data: { token, user }, timestamp }`
