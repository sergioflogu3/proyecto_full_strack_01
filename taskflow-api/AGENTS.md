# TaskFlow API — Agent Guide

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload (ts-node-dev) |
| `npm run build` | Compile TS → `dist/` |
| `npm start` | Run compiled output |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma client (after schema changes) |
| `npx prisma migrate deploy` | Apply migrations in production |

No test runner, linter, or formatter configured.

## Setup

1. `cp .env.example .env`
2. Ensure PostgreSQL is running
3. `npx prisma migrate dev` — creates tables from `prisma/schema.prisma`
4. `npm run dev`

Required env vars:
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — server port (default 3000)
- `JWT_SECRET` — token signing secret (min 32 chars)
- `JWT_EXPIRES_IN` — token lifetime (e.g. `7d`)
- `NODE_ENV` — `development` or `production`

## Architecture

```
src/
  index.ts              — Express 5 entry, CORS, global auth middleware, routes
  config/
    prisma.ts           — PrismaClient singleton (ORM, not raw pg)
    swagger.ts          — OpenAPI spec for /api-docs
  routes/               — /health, /api/auth, /api/users, /api/projects,
                          /api/tasks, /api/comments
  controllers/          — Request handlers
  services/             — Business logic (users, auth, projects, tasks, comments)
  middleware/
    auth.middleware.ts  — JWT verification (protects all /api/* except auth login/register)
    validate.middleware.ts — Zod schema validation
  schema/               — Zod schemas for auth and tasks
  types/                — TypeScript interfaces
  utils/
    api-response.ts     — success() / error() helpers ({ status, message, data, timestamp })
```

- Swagger docs at `/api-docs`
- Auth: JWT bearer token on all `/api/*` routes except `POST /api/auth/login` and `POST /api/auth/register`
- Response format: `{ status, message, data, timestamp }`
- `dist/` is gitignored
