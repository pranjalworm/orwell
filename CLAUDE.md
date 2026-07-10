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

# Database (PostgreSQL via Docker)
docker-compose up -d
```

No `*.spec.ts` files exist yet, so `pnpm --filter bigbrother test` / `test:e2e` (Jest) have nothing to run — don't try to run or "fix" them.

## Architecture

### Backend — `apps/bigbrother`

NestJS 11 on TypeScript. Entry point is `src/main.ts` (sets `/api` global prefix, CORS, and a global `ValidationPipe`). The root module is `AppModule` in `src/app.module.ts`, which imports `ConfigModule` (global), `PrismaModule` (global), and `BooksModule`.

Feature layout:
- `src/prisma/` — `PrismaService` (extends `PrismaClient`, manages connect/disconnect) wrapped in a `@Global()` `PrismaModule`.
- `src/books/` — `BooksController` (`GET /api/books`, `POST /api/book`), `BooksService`, `CreateBookDto` (class-validator), and a `MulterModule.registerAsync` setup for disk uploads to `BOOKS_PATH`.
  - `listBooks()` currently just `readdir`s `BOOKS_PATH` and returns filenames — it does **not** query Prisma. The catalogue endpoint is not yet backed by the `books` table.
  - `ingestBook()` uses `prisma.$transaction` for atomic `book` → `file` → `book_files` creation, and lowercases `title`/`author` on write.
- `prisma/schema.prisma` — Book, File, BookFile models. Migrations live in `prisma/migrations/`; the initial migration was baselined against the existing database with `prisma migrate resolve --applied 0_init`.

**Environment** (`apps/bigbrother/.env`, gitignored):
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — defaults to 3000
- `BOOKS_PATH` — path to book asset files (default `./assets/books`)

**Database**: PostgreSQL 17. Credentials: `orwell`/`orwell`, db `orwell`, port 5432. Start with `docker-compose up -d`. Schema changes go through `pnpm --filter bigbrother db:migrate`.

### Frontend — `apps/doublethink`

React 19 + Vite + Tailwind CSS 4. Key libraries: React Router 7, TanStack React Query 5. Entry point `src/main.tsx` → `App.tsx` (defines routes, wraps app in `QueryClientProvider`).

Pages are in `src/pages/`; shared chrome (`NavBar`, `SideBar`) is in `src/components/`. Current routes (all defined inline in `App.tsx`, no router config file):
- `/` → `CataloguePage` — book grid, queries `GET http://localhost:3000/api/books` (hardcoded URL, no Vite proxy or env var)
- `/book/:id` → `BookDetailPage`
- Category routes (`/shelf`, `/reading-now`, `/fiction`, `/non-fiction`, `/poetry`, `/essays`, `/history`) all currently render `CataloguePage`

Design system: Material Design 3 color tokens. Typography: Newsreader (serif, headings) + Manrope (sans-serif, body). Icons: Material Symbols.

### Shared — `packages/shared`

Exports `Book`, `File`, and `BookFile` TypeScript interfaces from `src/interfaces.ts` (ESM package, `@orwell/shared`). No compilation step — apps import directly from source via `paths` in the root `tsconfig.json`.

Note: these interfaces have drifted from `prisma/schema.prisma` (e.g. `Book.file: File` singular vs. the schema's many-to-many `bookFiles`, and `yearPublished`/`coverImageUrl` typed as `Date`/`URL` vs. the schema's `Int?`/`String?`). Don't assume the interfaces are an accurate mirror of the DB shape.

## Gotchas

- **bigbrother is CommonJS**, not ESM (no `"type": "module"` in its `package.json`) — `doublethink` and `shared` are ESM. Don't add `.js` extensions to bigbrother's local relative imports.
- **No tests exist yet** in `apps/bigbrother` — `test`/`test:e2e` scripts are wired up but there are no `*.spec.ts` files to run.
- `pnpm-workspace.yaml` lists `onlyBuiltDependencies`/`allowBuilds` for `@nestjs/core`, `@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`, `@swc/core` — required for their native/build-script installs under pnpm.
- `prisma generate` runs on `postinstall`. After editing `schema.prisma`, run `pnpm --filter bigbrother db:migrate` (dev) or `pnpm --filter bigbrother exec prisma generate` manually.
