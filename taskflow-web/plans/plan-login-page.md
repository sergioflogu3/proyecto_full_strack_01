# Plan: LoginPage.tsx (React + TypeScript + Tailwind v4)

## Objetivo
Crear el componente `src/pages/LoginPage.tsx` para un login funcional contra un backend que responde con formato `ApiResponse<T>`, ya desenvuelto por `authService.login()`.

## Contrato real del endpoint

**Endpoint:** `POST /api/auth/login`

**Request body:**
```json
{
  "email": "sergio.flores@example.com",
  "password": "password123"
}
```

**Response body (200):**
```json
{
  "status": 200,
  "message": "Operación exitosa",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1e6a2bea-ece0-4590-9ca8-477c1d4a7e4e",
      "name": "sergio.flores",
      "email": "sergio.flores@example.com"
    }
  },
  "timestamp": "2026-07-01T10:47:06.019Z"
}
```

### ⚠️ Discrepancia a resolver por el agente
El formato original descrito para `ApiResponse` usaba `success: boolean`, pero la respuesta real del backend usa `status: number` (`200`) y agrega `timestamp: string`. **No asumir cuál es el formato correcto**: el agente debe:
1. Abrir el `authService` real del proyecto (o el tipo `ApiResponse` en `src/types/`) y verificar contra cuál de los dos formatos está tipado.
2. Si el tipo `ApiResponse` ya usa `success`, actualizarlo para reflejar `status`/`timestamp`, o confirmar con el equipo si el backend tiene ambos formatos según el endpoint.
3. Ajustar `authService.login()` si es necesario para que siga devolviendo `{ token, user }` desenvuelto correctamente (ya sea chequeando `status === 200` o `success === true`, según corresponda).
4. `LoginPage.tsx` **no debe verse afectado** por este cambio: sigue recibiendo `{ token, user }` ya desenvuelto de `authService.login()`, sin importar el formato interno del `ApiResponse`.

### Tipo `User` (según respuesta real)
```ts
interface User {
  id: string;
  name: string;
  email: string;
}
```
- Confirmar si el tipo `User` ya existente en el proyecto coincide con estos 3 campos, o si tiene campos adicionales/diferentes (ej. `firstName`/`lastName` en vez de `name`) y ajustar en consecuencia.

## Contexto / Supuestos del stack
- Vite + React Router v6 + Axios
- Tailwind CSS v4 ya configurado (sin `tailwind.config.js` obligatorio, usa `@import "tailwindcss"` en el CSS global)
- Existe un hook `useAuth()` que expone `login(token: string, user: User): void`
- Existe un servicio `authService.login(email, password)` que:
  - Hace `POST /api/auth/login` con `{ email, password }`
  - Recibe el `ApiResponse` del backend (ver contrato real arriba)
  - Devuelve ya desenvuelto `{ token, user }` (o lanza error si la respuesta indica fallo)
- Existe un tipo `User` importable (ubicación a confirmar, ej. `src/types/user.ts`)

## Archivos a tocar/crear
1. `src/pages/LoginPage.tsx` (nuevo o a sobrescribir)
2. Verificar rutas existentes en el router para confirmar el path `/login` y `/register` ya estén declarados (no crear router nuevo, solo usar `<Link>` y `useNavigate`)

## Tipos e imports esperados
```ts
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService'; // ajustar path real
import { useAuth } from '../hooks/useAuth'; // ajustar path real
```
- Confirmar el path real de `authService` y `useAuth` en el proyecto antes de escribir los imports (buscar con `grep`/`view` en `src/`).

## Estado del componente (useState)
- `email: string` (inicial `''`)
- `password: string` (inicial `''`)
- `error: string` (inicial `''`)
- `loading: boolean` (inicial `false`)

## Lógica de handleSubmit
Firma: `const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { ... }`

Pasos dentro:
1. `e.preventDefault()`
2. `setError('')`
3. `setLoading(true)`
4. `try`:
   - `const { token, user } = await authService.login(email, password);`
   - `login(token, user);` (del hook `useAuth()`)
   - `navigate('/dashboard', { replace: true });`
5. `catch (err: any)`:
   - `setError(err.response?.data?.message ?? err.message ?? 'Error');`
6. `finally`:
   - `setLoading(false)`

> Nota: tipar `err` como `any` o usar un narrowing con `AxiosError` si el proyecto ya usa ese patrón en otros lados (revisar consistencia).

## Estructura visual (Tailwind v4)
- Contenedor raíz: `min-h-screen flex items-center justify-center bg-gray-100`
- Card: `bg-white shadow-md rounded-lg p-8 w-full max-w-md`
- Título: `text-2xl font-bold mb-6 text-center` (ej. "Iniciar sesión")
- Form: `space-y-4`
- Inputs (email y password):
  - `type="email"` / `type="password"`
  - `className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"`
  - `required`
  - `value` + `onChange` controlados
  - `disabled={loading}` (opcional pero recomendado para consistencia con el botón)
- Bloque de error: renderizar solo si `error` no está vacío
  - `<div className="bg-red-100 text-red-700 border border-red-300 rounded px-3 py-2 text-sm mb-4">{error}</div>`
- Botón submit:
  - `type="submit"`
  - `disabled={loading}`
  - texto condicional: `{loading ? 'Ingresando...' : 'Ingresar'}`
  - clases: `w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`
- Link a registro al final del card:
  - `<p className="text-sm text-center mt-4">¿No tenés cuenta? <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link></p>`

## Checklist de validación final
- [ ] `useState` tipado explícitamente donde no se infiere solo (`error: string`, `loading: boolean`)
- [ ] `handleSubmit` usa `FormEvent<HTMLFormElement>`, no `any`
- [ ] Orden correcto: `authService.login()` → `login(token, user)` → `navigate('/dashboard', { replace: true })`
- [ ] Manejo de error exacto: `err.response?.data?.message ?? err.message ?? 'Error'`
- [ ] Botón deshabilitado y texto cambia durante `loading`
- [ ] Error solo se muestra si `error !== ''`
- [ ] Link a `/register` presente
- [ ] Clases Tailwind: fondo gris claro, card blanca centrada con sombra, `max-w-md`, inputs con `border`
- [ ] No usar `any` salvo en el catch (o tipar con `AxiosError` si aplica)
- [ ] Componente exportado como `export default function LoginPage()`

## Pasos sugeridos para el agente
1. Localizar en el repo los paths reales de `authService`, `useAuth` y el tipo `User` (`grep -r "authService" src/`, `grep -r "useAuth" src/`).
2. Verificar el tipo `ApiResponse` y la implementación de `authService.login()` contra el contrato real documentado arriba (`status` + `timestamp`, no `success`) y corregir si hace falta.
3. Confirmar que el tipo `User` tenga los campos `id`, `name`, `email` (o ajustar si el proyecto usa otros nombres).
4. Confirmar que las rutas `/register` y `/dashboard` existen en el router (o avisar si no).
5. Escribir `LoginPage.tsx` siguiendo la estructura de arriba.
6. Correr `tsc --noEmit` o el build de Vite para verificar que no haya errores de tipos.
7. Revisar visualmente (o describir) que las clases Tailwind v4 usadas sean válidas en la config del proyecto (v4 no requiere `content` en config, pero sí que el CSS importe `@import "tailwindcss";`).
