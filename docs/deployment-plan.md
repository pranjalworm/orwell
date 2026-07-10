# Orwell — Deployment Plan

Two environments: **local** (Docker Compose, S3-compatible storage via MinIO) and **prod** (AWS: EC2 + Aurora PostgreSQL Serverless v2 + S3 + CloudFront + Route 53).

> **Revision note**: this is the final plan after a review pass caught several issues in the original draft (RDS/Aurora confusion, ARM64 build mismatch, a missing `prisma` CLI at migration time, a Multer breaking change, and a Prisma/S3 data-shape gap in `listBooks()`). Each fix is called out inline with a "**Fix:**" marker so the reasoning isn't lost.

---

## Part 1: Local Dev Environment (Docker Compose)

### Architecture

```
Host (macOS)
├── Vite :5173 (HMR for frontend work)
│     └── proxy /api/* → nginx :80
└── Docker Compose
    ├── nginx :80            → reverse proxy to backend
    ├── bigbrother :3000     → NestJS (nest start --watch with bind mount)
    ├── postgres :5432       → same major version as prod Aurora (17)
    └── minio :9000          → S3-compatible API (books bucket)
```

### Files to create / extend

#### `docker-compose.yml` (repo root) — **extend, not create**

**Fix:** the repo already has a root `docker-compose.yml` with a working `db` (Postgres) service — add the new services to it rather than overwriting the file, or the existing Postgres definition gets clobbered.

- **db** (existing): `postgres:17`, keep as-is
- **minio** (new): `minio/minio`, ports 9000 (API) + 9001 (console), persistent volume, init script creates `books` bucket
- **bigbrother** (new): Built from `apps/bigbrother/Dockerfile.dev`, source as bind mount for hot reload, env vars pointing to local postgres + local minio
- **nginx** (new): `nginx:alpine`, config at `docker/nginx/default.conf`, proxies `/api/` → bigbrother:3000

#### `apps/bigbrother/Dockerfile.dev`

- Base: `node:22-alpine`, install pnpm, copy package.json + lockfiles + workspace config
- `pnpm install --frozen-lockfile`
- Keep source as bind mount (not copied into image)
- `CMD ["pnpm", "--filter", "bigbrother", "start:dev"]`

#### `docker/nginx/default.conf`

```nginx
server {
    listen 80;
    location /api/ {
        proxy_pass http://bigbrother:3000;
        proxy_set_header Host $host;
        client_max_body_size 100M;
    }
}
```

#### `docker/minio/init.sh`

Uses `mc` (MinIO client) to create `books` bucket on startup.

### Env Vars for Local

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://orwell:orwell@postgres:5432/orwell` |
| `S3_ENDPOINT` | `http://minio:9000` |
| `S3_REGION` | `eu-central-1` |
| `S3_BUCKET` | `books` |
| `S3_ACCESS_KEY_ID` | `minioadmin` |
| `S3_SECRET_ACCESS_KEY` | `minioadmin` |
| `S3_FORCE_PATH_STYLE` | `true` |
| `PORT` | `3000` |

### App code changes — `apps/bigbrother`

**New runtime dependencies**: `@aws-sdk/client-s3`, `@aws-sdk/lib-storage`, `@aws-sdk/s3-request-presigner`

**Fix — move `prisma` out of devDependencies**: `package.json` currently lists `prisma` under `devDependencies`. The prod Docker image only installs production dependencies (see Part 3), so the `prisma` CLI must move to `dependencies`, otherwise `npx prisma migrate deploy` has no local binary at deploy time and silently falls back to fetching from the npm registry inside the container.

**`src/storage/storage.module.ts`** (new) — Provides `S3Client` as a global provider. Configures endpoint from `S3_ENDPOINT` (optional — falls back to default AWS endpoint when not set). Sets `forcePathStyle: true` when endpoint is present.

**`src/books/books.module.ts`** — Replace Multer `diskStorage` with `memoryStorage`. Remove ConfigService injection from Multer config. Import StorageModule.

**`src/books/books.service.ts`** —
- **Fix — `memoryStorage` breaks the current field reads**: today's `ingestBook()` reads `file.filename` and `file.path`, both of which are only populated by Multer's `diskStorage`. Under `memoryStorage`, `file.filename` is `undefined` and `file.path` doesn't exist. Update the code to read `file.originalname` (for `File.name`) and `file.buffer` (for the upload body).
- `ingestBook()`: Upload `file.buffer` via `Upload` from `@aws-sdk/lib-storage`. Store the S3 key `books/<uuid>/<originalname>` in `File.filePath`.
- **Fix — `listBooks()` must query Prisma, not just list S3 objects**: `CataloguePage.tsx` renders `book.id`, `book.title`, `book.author`, and `book.cover` — none of which exist on a raw S3 object listing, and the current implementation (`fs.readdir` on `BOOKS_PATH`) doesn't return any of them either. Replace it with a Prisma query: `prisma.book.findMany({ include: { bookFiles: { include: { file: true } } } })`, then map each book to `{ id, title, author, yearPublished, cover: <presigned URL from the cover/file key> }` using `getSignedUrl(GetObjectCommand)` per file key. This is what makes "no frontend changes needed" (below) actually true.
- Add `getFileUrl(key)` public method returning a presigned URL, used by the mapping above.

**`src/books/books.controller.ts`** — `GET /api/books` now returns books shaped as `{ id, title, author, yearPublished, cover, downloadUrl }`, matching what `CataloguePage.tsx` already expects. No frontend changes needed for the catalogue page itself.

**No Prisma schema changes** — `File.filePath` stores an S3 key in both local and prod. The schema is identical.

### App code changes — `apps/doublethink`

**`vite.config.ts`** — Add proxy:

```ts
server: { proxy: { '/api': 'http://localhost' } }
```

**`CataloguePage.tsx`** — Change `fetch("http://localhost:3000/api/books")` → `fetch("/api/books")`. Proxy handles it in dev, same-origin handles it in prod via CloudFront.

---

## Part 2: Production Infrastructure (AWS)

### Resource Map

```
CloudFront (orwell.yourdomain.com)
├── /api/* → EC2 :80 (nginx) → 127.0.0.1:3000 (Docker container: bigbrother)
└── /*     → S3 frontend bucket (OAI access)

Dependencies of the container:
  DATABASE_URL → Aurora PostgreSQL Serverless v2 (private subnet)
  S3 client    → S3 books bucket (private, instance-role access)

ECR repository: orwell/bigbrother (pushed from CI, pulled on EC2)
```

**Fix — clarified nginx placement**: nginx listens on port 80 (public, behind CloudFront) and reverse-proxies to the container, which is bound only to `127.0.0.1:3000` on the host (not publicly reachable directly). The original resource map's "`nginx :3000`" notation was ambiguous about which process owns which port.

### Bootstrap Order

#### 1. Route 53
- Register or transfer domain
- Create hosted zone

#### 2. ACM Certificate
- Request `*.yourdomain.com` in `eu-central-1` (CloudFront requirement)
- DNS-validate via Route 53

#### 3. S3 Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `orwell-books-<suffix>` | Book file storage | EC2 instance role only |
| `orwell-frontend-<suffix>` | Vite production build | CloudFront OAI only |

#### 4. ECR
- Create private repo: `orwell/bigbrother`

#### 5. Database — Aurora PostgreSQL Serverless v2

**Fix — "RDS Serverless v2" doesn't exist for plain PostgreSQL.** Serverless v2 is an **Aurora** capacity mode, not a standard RDS-for-PostgreSQL feature. To keep the "pause when idle" cost intent from the original plan, use **Aurora PostgreSQL-Compatible, Serverless v2**, not "RDS PostgreSQL."

- Aurora PostgreSQL 17-compatible, Serverless v2, **min capacity 0 ACU** (scale-to-zero — true pause when idle), max capacity 1 ACU, 20 GB storage
- **Requires a DB subnet group spanning ≥2 Availability Zones** — this is an Aurora requirement even though the writer instance itself runs in one AZ. See the VPC fix below.
- No public access, security group allows 5432 from EC2 SG only
- Password stored in `.env` file on EC2 (and GitHub secret for CI)

#### 6. VPC & Networking

**Fix — needs a second subnet for the Aurora subnet group.**

- VPC `10.0.0.0/16`
- Two public subnets in different AZs: `10.0.1.0/24` (AZ-a, hosts EC2) and `10.0.2.0/24` (AZ-b, unused except to satisfy the Aurora DB subnet group requirement)
- Internet Gateway + route table (both subnets)
- Security groups: EC2 SG (SSH from your IP, HTTP from the `com.amazonaws.global.cloudfront.origin-facing` managed prefix list — see fix below), RDS/Aurora SG (5432 from EC2 SG)
- Allocate Elastic IP

**Fix — use the CloudFront managed prefix list for the EC2 SG**, not a hand-maintained IP list: `com.amazonaws.global.cloudfront.origin-facing`. AWS maintains this list for exactly this purpose, so the security group rule stays correct as CloudFront's edge IPs change.

#### 7. EC2
- Amazon Linux 2023 (**ARM64 / Graviton2**), `t4g.micro`, 20 GB gp3
- IAM role: S3 access on books bucket + ECR pull + CloudWatch logs
- User data: install Docker + nginx, write nginx config, ECR login, pull + run container
- Key pair for SSH

**Note — memory pressure risk (accepted for now)**: `t4g.micro` has 1 GiB RAM. `memoryStorage` buffers each uploaded book file fully in Node process memory before streaming to S3, and nginx allows up to 100 MB per request. For a single-user hobby app this is a low-probability risk, but if uploads start failing or the process gets OOM-killed under concurrent uploads, the fix is either bumping to `t4g.small` or switching the upload path to a streaming multer storage engine instead of `memoryStorage`.

#### 8. EC2 run script (`/home/ec2-user/run.sh`)

```bash
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $REPO
docker pull $REPO:latest
docker stop bigbrother || true && docker rm bigbrother || true
docker run -d --name bigbrother --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -e DATABASE_URL -e S3_BUCKET -e S3_REGION -e NODE_ENV=production \
  $REPO:latest
```

#### 9. CloudFront

| Setting | Value |
|---|---|
| Origin 1 — S3 | `orwell-frontend-<suffix>.s3.eu-central-1.amazonaws.com` |
| Origin 2 — HTTP | Elastic IP (EC2) |
| Default behavior | Origin 1, viewer HTTPS only |
| Behavior `/api/*` | Origin 2, viewer HTTPS only |
| Error pages | 403 → `/index.html` (SPA fallback) |
| SSL cert | `*.yourdomain.com` from ACM |
| Alternate domain | `orwell.yourdomain.com` |

#### 10. Route 53 Record
- `orwell.yourdomain.com` → A alias to CloudFront

---

## Part 3: CI/CD (GitHub Actions)

### File: `.github/workflows/deploy.yml`

**Trigger**: Push to `main`

**Backend job**:
1. Checkout + setup Node 22 + pnpm
2. `pnpm install --frozen-lockfile`
3. `pnpm --filter bigbrother build`
4. Build Docker image (`apps/bigbrother/Dockerfile` — multi-stage), **targeting `linux/arm64`** (see fix below)
5. Tag: `prod-<sha>` + `prod-latest`
6. Push to ECR
7. SSH into EC2 → pull image → run migration → restart container

**Fix — build for ARM64, not the runner's native architecture.** EC2 is `t4g.micro` (Graviton2, ARM64). GitHub-hosted `ubuntu-latest` runners are x86_64, and a plain `docker build`/`docker push` there produces an amd64 image that fails to execute on the instance (`exec format error`). Use Buildx with QEMU:

```yaml
- uses: docker/setup-qemu-action@v3
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v6
  with:
    context: .
    file: apps/bigbrother/Dockerfile
    platforms: linux/arm64
    push: true
    tags: |
      ${{ steps.ecr.outputs.registry }}/orwell/bigbrother:prod-${{ github.sha }}
      ${{ steps.ecr.outputs.registry }}/orwell/bigbrother:prod-latest
```

**Frontend job**:
1. Checkout + setup Node 22 + pnpm
2. `pnpm install --frozen-lockfile`
3. `pnpm --filter doublethink build`
4. `aws s3 sync apps/doublethink/dist/ s3://orwell-frontend-<suffix>/ --delete`
5. `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`

**IAM for CI**: GitHub OIDC role with permissions for ECR push, S3 sync, CloudFront invalidation.

### `apps/bigbrother/Dockerfile` (prod)

Multi-stage:
- **Builder**: `node:22-alpine`, install pnpm, copy monorepo, install, build, prisma generate
- **Runtime**: `node:22-alpine`, copy `dist/` + `prisma/` + production `node_modules`, `CMD ["node", "dist/main"]`

**Fix**: since `prisma` moved to `dependencies` (Part 1), the runtime stage's `node_modules` now includes the `prisma` CLI, so `npx prisma migrate deploy` (Part 4) works without hitting the npm registry from inside the container.

### `.dockerignore` (repo root)

```
node_modules/ dist/ .turbo/ .git/ .env .env.*
apps/doublethink/ apps/bigbrother/test/ apps/bigbrother/.env
*.md
```

---

## Part 4: Prisma Migrations

- Migration files committed to git in `apps/bigbrother/prisma/migrations/`
- CI runs migrations via: `docker run --rm --network host <image> npx prisma migrate deploy`
- Run before main container restart to avoid schema mismatch
- Depends on the Part 1 / Part 3 fix of moving `prisma` into `dependencies` — otherwise this step has no CLI to run and silently reaches out to the npm registry

---

## Part 5: Cost Estimate (Monthly)

**Fix — corrected for the Aurora swap and 2024 AWS public-IPv4 pricing change.** Since Feb 2024, AWS bills all public IPv4 addresses — including attached Elastic IPs — at ~$0.005/hr (~$3.60/mo); the original "$0.00" line was stale. Aurora Serverless v2 billing is usage-based (ACU-hours + storage/IO), so the number below is an estimate for a mostly-idle single-user app, not a fixed price.

| Service | Config | Cost |
|---|---|---|
| EC2 t4g.micro | On-demand, 20 GB gp3 | $8.76 |
| Elastic IP | Attached (billed since Feb 2024) | ~$3.60 |
| Aurora PostgreSQL Serverless v2 | min 0 ACU (scale-to-zero), 20 GB storage, light usage | ~$5–8 (usage-dependent) |
| Route 53 hosted zone | 1 zone | $0.50 |
| Domain (amortized) | ~$12/yr | $1.00 |
| ACM cert | Free | $0.00 |
| CloudFront | 2 origins, minimal traffic | ~$1.00 |
| S3 (books + frontend) | Minimal | ~$1.50 |
| ECR | Single image | ~$0.10 |
| Data transfer | Minimal | ~$1-3 |
| **Total** | | **~$23–27/mo** |

---

## Implementation Order

### Week 1 — Local Dev

1. Move `prisma` from `devDependencies` to `dependencies` in `apps/bigbrother/package.json`
2. Add AWS SDK v3 deps to bigbrother
3. Create `StorageModule` (S3 client provider)
4. Refactor `BooksService` — S3 uploads (`file.buffer`/`file.originalname`) + Prisma-backed `listBooks()` with presigned URLs
5. Refactor `BooksController` — return presigned URLs in the book-list response shape the frontend already expects
6. Fix `vite.config.ts` proxy, update `CataloguePage.tsx` to use `/api/books`
7. Extend `docker-compose.yml` (don't overwrite) + add `Dockerfile.dev` + nginx config + MinIO init
8. Smoke test: upload a book, verify it appears in MinIO console, list books via API, confirm the catalogue page renders id/title/author/cover correctly

### Week 2 — AWS Bootstrap

1. Route 53 hosted zone + ACM cert
2. S3 buckets (frontend OAI + books private)
3. ECR repo
4. VPC + **two subnets across two AZs** + IGW + security groups (EC2 SG using the CloudFront managed prefix list)
5. Aurora PostgreSQL Serverless v2 (min capacity 0 ACU) + DB subnet group
6. IAM roles (EC2 instance, GitHub OIDC)
7. EC2 launch + nginx config + run script
8. CloudFront distribution
9. Route 53 A record

### Week 3 — CI/CD

1. `apps/bigbrother/Dockerfile` (prod multi-stage)
2. `.github/workflows/deploy.yml`, including Buildx/QEMU `linux/arm64` build step
3. GitHub secrets (EC2_HOST, EC2_SSH_KEY, DATABASE_URL, AWS account info)
4. Push to main → verify full pipeline, including that the pulled image actually runs on the ARM64 instance
5. End-to-end test: browse to domain, upload book, see it in gallery

---

## Decisions Made

1. **EC2 OS**: Amazon Linux 2023 (`dnf`), ARM64/Graviton2
2. **Secrets at runtime**: `.env` file on EBS (not Parameter Store)
3. **Docker Compose context**: Repo root, `dockerfile: apps/bigbrother/Dockerfile.dev` — confirmed
4. **Database**: Aurora PostgreSQL Serverless v2, min capacity 0 ACU (true scale-to-zero pause when idle) — *revised from the original "RDS Serverless v2," which doesn't exist as a product; Aurora is the correct service for this capacity model and requires a 2-AZ subnet group*
5. **Container builds target `linux/arm64` explicitly** via Buildx/QEMU in CI, to match the Graviton2 EC2 instance
6. **`prisma` lives in `dependencies`**, not `devDependencies`, so the production runtime image can run `prisma migrate deploy` without reaching out to the npm registry
