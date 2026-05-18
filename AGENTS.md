# AGENTS.md

## Commands

```sh
pnpm build          # builds all packages via turborepo
pnpm dev            # runs all dev servers
```

Per-package (run from repo root):
```sh
pnpm --filter bigbrother dev        # tsup watch + node dist/server.js
pnpm --filter bigbrother build      # tsup → dist/
pnpm --filter bigbrother start      # node dist/server.js

pnpm --filter doublethink dev       # vite HMR
pnpm --filter doublethink build     # tsc -b && vite build
pnpm --filter doublethink lint      # eslint
```

## Architecture

- **bigbrother** — Express 5 API backend. Entry: `apps/bigbrother/src/server.ts`. Port 3000.
- **doublethink** — React 19 frontend. Entry: `apps/doublethink/src/main.tsx`.
- **@orwell/shared** — Shared TypeScript interfaces (`Book`, `File`, `BookFile`). Imported directly from source — no build step required.

PostgreSQL 17 via `docker-compose up -d`. Credentials: `orwell/orwell/orwell`. DB at `localhost:5432`.

## Critical Gotchas

- **ESM throughout** — all packages have `"type": "module"`. bigbrother uses `"module": "NodeNext"` which **requires `.js` extensions** on all local imports (not `.ts`).
- **bigbrother uses `tsup`**, not `tsc` directly, for building. Config: `apps/bigbrother/tsup.config.ts`. `@orwell/shared` is bundled via `noExternal`.
- **Strict TypeScript in bigbrother**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`. These will catch errors the frontend won't.
- **No tests exist** in this repo yet. Do not try to run test commands.

## Env Config

Backend env lives in `apps/bigbrother/.env` (gitignored). Key vars:
- `BOOKS_PATH` — local path for book assets (default `./assets/books`)
- `DATABASE_URL` — postgres connection string
- `PORT` — default `3000`

## Style Notes

- bigbrother tsconfig enforces `noUnusedLocals` and `noUnusedParameters` — dead code will fail compilation.
- doublethink uses default Vite + React plugin setup, no path aliases or custom config.
