# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Orwell** is a self-hosted digital library manager. The codebase is a pnpm + Turborepo monorepo with two apps and one shared package.

```
apps/
  bigbrother/   # Express 5 backend API (TypeScript, ESM)
  doublethink/  # React 19 frontend (Vite + TypeScript)
packages/
  shared/       # Shared TypeScript interfaces (Book, File, BookFile)
```

## Commands

All commands use `pnpm`. Run from the repo root unless noted.

**Whole monorepo:**
```sh
pnpm build          # Turborepo build (builds shared → apps in dependency order)
```

**doublethink (frontend):**
```sh
pnpm --filter doublethink dev       # Vite dev server with HMR
pnpm --filter doublethink build     # tsc + vite build → dist/
pnpm --filter doublethink lint      # ESLint
pnpm --filter doublethink preview   # Preview production build
```

**bigbrother (backend):**
```sh
pnpm --filter bigbrother dev        # tsx watch (hot-reload, no compile step)
pnpm --filter bigbrother build      # tsc → dist/
pnpm --filter bigbrother start      # Run compiled dist/index.js
```

The backend runs on port `3000`.

## Architecture

- **`packages/shared`** contains the canonical data model interfaces (`Book`, `File`, `BookFile`). Both apps should consume types from here. The package is referenced as `@orwell/shared` in bigbrother's dependencies, but the `package.json` `name` field is currently `"shared"` — this is a known inconsistency that will need to be fixed for workspace resolution to work correctly.

- **Turborepo** (`turbo.json`) only defines a `build` task with `"dependsOn": ["^build"]`, so shared is always built before apps. There is no `dev` or `lint` task defined at the root level yet.

- **TypeScript** strict mode is enabled in both apps. bigbrother uses `"module": "nodenext"` with `"noUncheckedIndexedAccess"` and `"exactOptionalPropertyTypes"` — be careful with array/object access and optional properties.

- **ESM throughout** — all packages have `"type": "module"`. Import paths in bigbrother must include file extensions when referencing local files.
