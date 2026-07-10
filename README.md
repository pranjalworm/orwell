# orwell

Self-hosted digital library manager.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 11.1.1 (`corepack enable && corepack install`)
- **Docker** (for PostgreSQL 17)

## Quick Start

```sh
# Start PostgreSQL
docker-compose up -d

# Install dependencies & generate Prisma client
pnpm install

# Start dev servers (backend on :3000, frontend on :5173)
pnpm dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3000/api

## Dev Mode

```sh
pnpm dev                  # all packages via turborepo
pnpm --filter bigbrother dev    # backend only (NestJS watch)
pnpm --filter doublethink dev   # frontend only (Vite HMR)
```

## Production

```sh
pnpm build                # build all packages
pnpm --filter bigbrother start   # node dist/main
```

Frontend build output: `apps/doublethink/dist/` — serve with any static server.

## Database

PostgreSQL 17 with credentials `orwell`/`orwell` on port 5432.

```sh
pnpm --filter bigbrother db:migrate   # apply schema changes
pnpm --filter bigbrother db:studio    # Prisma Studio UI
```

Schema: `apps/bigbrother/prisma/schema.prisma`. Migrations run via Prisma.

## Environment

Backend variables in `apps/bigbrother/.env` (gitignored):

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://orwell:orwell@localhost:5432/orwell` | Postgres connection |
| `PORT` | `3000` | API port |
| `BOOKS_PATH` | `./assets/books` | Upload directory |

## Project Structure

```
apps/
  bigbrother/     NestJS 11 API backend  (CJS)
  doublethink/    React 19 + Vite frontend (ESM)
packages/
  shared/         TypeScript interfaces (ESM, consumed from source)
```

## Useful Commands

```sh
pnpm --filter bigbrother lint       # ESLint backend
pnpm --filter doublethink lint      # ESLint frontend
pnpm --filter bigbrother test       # Jest unit tests
pnpm --filter bigbrother test:e2e   # Jest E2E tests
pnpm --filter bigbrother exec prisma generate   # regenerate client
```
