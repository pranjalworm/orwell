# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

**Orwell** is a personal book management system — a self-hosted "Goodreads". It is a pnpm + Turborepo monorepo with two apps and one shared package:

- `apps/bigbrother` — NestJS backend API (currently being migrated from Express; see below)
- `apps/doublethink` — React 19 + Vite frontend
- `packages/shared` — TypeScript interfaces consumed directly from source (no build step)

## Commands

Run from the repo root unless otherwise noted.

```bash
# Start everything in dev mode
pnpm dev

# Build all packages (respects Turbo dependency order)
pnpm build

# Run a single app
pnpm --filter bigbrother dev      # NestJS watch mode (port 3000)
pnpm --filter doublethink dev     # Vite dev server

# Lint
pnpm --filter bigbrother lint
pnpm --filter doublethink lint

# Tests (bigbrother only, Jest)
pnpm --filter bigbrother test
pnpm --filter bigbrother test:e2e

# Database (PostgreSQL via Docker)
docker-compose up -d
```

## Architecture

### Backend — `apps/bigbrother`

NestJS 11 on TypeScript. Entry point is `src/main.ts`. The root module is `AppModule` in `src/app.module.ts`.

**Active migration**: the branch `migrate-to-nestjs` is porting the full Express implementation (preserved in `apps/bigbrother-temp/`) into NestJS modules. When adding features, follow NestJS conventions (modules, controllers, services) and look at `apps/bigbrother-temp/` for the existing business logic to port:

- `src/db/` — PostgreSQL pool, schema SQL, and query helpers per entity
- `src/services/Ingestion.service.ts` — book ingestion pipeline
- `src/controller/books.controller.ts` — books REST endpoints
- `src/routes/` — Express router definitions

**Environment** (`apps/bigbrother/.env`, gitignored):
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — defaults to 3000
- `BOOKS_PATH` — path to book asset files (default `./assets/books`)

**Database**: PostgreSQL 17. Credentials: `orwell`/`orwell`, db `orwell`, port 5432. Start with `docker-compose up -d`.

**TypeScript strictness**: `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` are all enabled. All packages use `"type": "module"` — use `.js` extensions in relative imports.

### Frontend — `apps/doublethink`

React 19 + Vite + Tailwind CSS 4. Key libraries: React Router 7, TanStack React Query 5.

Pages are in `src/pages/`. Current routes:
- `/` → `CataloguePage` — book grid, queries `GET http://localhost:3000/api/books`
- `/book/:id` → `BookDetailPage`
- Category routes (`/shelf`, `/reading-now`, `/fiction`, etc.) all currently render `CataloguePage`

Design system: Material Design 3 color tokens. Typography: Newsreader (serif, headings) + Manrope (sans-serif, body). Icons: Material Symbols.

### Shared — `packages/shared`

Exports `Book`, `File`, and `BookFile` TypeScript interfaces from `src/interfaces.ts`. No compilation step — apps import directly from source via path aliases.
