# AGENTS.md

## Commands (run from repo root)

```sh
pnpm build                      # turbo build — all packages
pnpm dev                        # turbo dev — all dev servers (dependsOn ^build)

pnpm --filter bigbrother dev    # nest start --watch (port 3000)
pnpm --filter bigbrother build  # nest build → dist/
pnpm --filter bigbrother start  # node dist/main
pnpm --filter bigbrother lint   # eslint
pnpm --filter bigbrother test   # jest (src/**/*.spec.ts)
pnpm --filter bigbrother test:e2e   # jest --config test/jest-e2e.json
pnpm --filter bigbrother db:migrate # prisma migrate dev
pnpm --filter bigbrother db:studio  # prisma studio

pnpm --filter doublethink dev   # vite HMR
pnpm --filter doublethink build # tsc -b && vite build
pnpm --filter doublethink lint  # eslint
```

`postinstall` runs `prisma generate` (bigbrother). Start DB first: `docker-compose up -d`.

## Architecture

- **bigbrother** — NestJS 11 API backend. Entry: `apps/bigbrother/src/main.ts`. Port 3000, global `/api` prefix, CORS enabled, `ValidationPipe({ transform: true, whitelist: true })`.
  - `AppModule` imports `ConfigModule.forRoot({ isGlobal: true })`, `PrismaModule` (`@Global()`), `BooksModule`.
  - `PrismaService` extends `PrismaClient` with lifecycle connect/disconnect.
  - `BooksController` exposes `GET /api/books`, `POST /api/book` (multipart file upload via Multer to `BOOKS_PATH`).
  - Uses `@nestjs/cli` (not tsup). Config: `nest-cli.json`, tsconfig `module: "nodenext"`, CJS (no `"type": "module"`).

- **doublethink** — React 19 + Vite + Tailwind CSS 4 + React Router 7 + TanStack React Query 5. Entry: `apps/doublethink/src/main.tsx`.
  - Hardcodes API URL `http://localhost:3000/api/books` (no Vite proxy). Routes in `App.tsx`.

- **@orwell/shared** — TypeScript interfaces (`Book`, `File`, `BookFile`). ESM, consumed directly from `packages/shared/src/index.ts` via `paths` in root `tsconfig.json` — no build step.

- **Prisma** (`apps/bigbrother/prisma/schema.prisma`): `Book`, `File`, `BookFile` models. UUIDs via `gen_random_uuid()`. DB: PostgreSQL 17 (`docker-compose up -d`, `orwell/orwell/orwell`, port 5432).

## Environment

Backend env at `apps/bigbrother/.env` (gitignored):
- `DATABASE_URL` — `postgresql://orwell:orwell@localhost:5432/orwell`
- `PORT` — default `3000`
- `BOOKS_PATH` — default `./assets/books`

## Gotchas

- **bigbrother is CJS** (no `"type": "module"`). Only `doublethink` and `shared` are ESM (`"type": "module"`). Do **not** add `.js` extensions to bigbrother local imports.
- **No tests exist yet** — `*.spec.ts` files and test directory hover empty. Do not try to run tests.
- **prisma generate runs on postinstall** — if you change `schema.prisma`, run `pnpm --filter bigbrother db:migrate` (dev) or `pnpm --filter bigbrother exec prisma generate` manually.
- `@nestjs/core`, `@prisma/client`, `@prisma/engines`, `prisma`, `esbuild`, `@swc/core` require `onlyBuiltDependencies` / `allowBuilds` in `pnpm-workspace.yaml`.
