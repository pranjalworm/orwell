# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

**Orwell** is a personal book management system — a self-hosted "Goodreads". It is a pnpm + Turborepo monorepo with two apps and one shared package:

- `apps/bigbrother` — NestJS backend API
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

NestJS 11 on TypeScript. Entry point is `src/main.ts` (sets `/api` global prefix, CORS, and a global `ValidationPipe`). The root module is `AppModule` in `src/app.module.ts`, which imports `ConfigModule` (global), `PrismaModule` (global), and `BooksModule`.

Feature layout:
- `src/prisma/` — `PrismaService` (extends `PrismaClient`, manages connect/disconnect) wrapped in a `@Global()` `PrismaModule`.
- `src/books/` — `BooksController` (`GET /api/books`, `POST /api/book`), `BooksService` (uses `prisma.$transaction` for atomic book/file/book_files ingestion), `CreateBookDto` (class-validator), and a `MulterModule.registerAsync` setup for disk uploads to `BOOKS_PATH`.
- `prisma/schema.prisma` — Book, File, BookFile models. Migrations live in `prisma/migrations/`; the initial migration was baselined against the existing database with `prisma migrate resolve --applied 0_init`.

**Environment** (`apps/bigbrother/.env`, gitignored):
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — defaults to 3000
- `BOOKS_PATH` — path to book asset files (default `./assets/books`)

**Database**: PostgreSQL 17. Credentials: `orwell`/`orwell`, db `orwell`, port 5432. Start with `docker-compose up -d`. Schema changes go through `pnpm --filter bigbrother db:migrate`.

### Frontend — `apps/doublethink`

React 19 + Vite + Tailwind CSS 4. Key libraries: React Router 7, TanStack React Query 5.

Pages are in `src/pages/`. Current routes:
- `/` → `CataloguePage` — book grid, queries `GET http://localhost:3000/api/books`
- `/book/:id` → `BookDetailPage`
- Category routes (`/shelf`, `/reading-now`, `/fiction`, etc.) all currently render `CataloguePage`

Design system: Material Design 3 color tokens. Typography: Newsreader (serif, headings) + Manrope (sans-serif, body). Icons: Material Symbols.

### Shared — `packages/shared`

Exports `Book`, `File`, and `BookFile` TypeScript interfaces from `src/interfaces.ts`. No compilation step — apps import directly from source via path aliases.
