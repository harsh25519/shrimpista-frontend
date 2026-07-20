# Shrimpista — Frontend

A production-ready React SPA for the **Shrimpista** URL shortener API (Spring Boot backend, `mtAuth` for identity). Built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Zustand, and Axios.

## Stack & versions

| Tool | Version |
|---|---|
| React | 19.2 |
| Vite | 8.1 |
| TypeScript | 6.0 |
| Tailwind CSS | 4.3 (Vite plugin, no PostCSS config needed) |
| Node (build/runtime) | 22 LTS |
| Nginx (Docker runtime) | 1.27 alpine |

All dependency versions are pinned via `package-lock.json`; the Docker build uses `npm ci` for reproducible installs.

## Features

- Email/password signup, login, logout, forgot-password (all proxied through the backend to `mtAuth`)
- Google / GitHub OAuth (redirect-based flow)
- JWT access/refresh handling with automatic silent refresh on `401`, via an Axios interceptor
- Dashboard: create, list (paginated), copy, edit, enable/disable, delete short links
- Per-link analytics page: total clicks, unique visitors, paginated raw click history
- Admin panel (role-gated): system-wide link list and force-takedown
- Anonymous link shortening on the public landing page
- Responsive, accessible (visible focus states, `prefers-reduced-motion` respected) dark UI

## API contract notes (things worth knowing)

The backend's documented DTOs have a couple of gaps that shape the frontend behavior:

- `UrlDashboardResponse` (returned by `GET /urls/my`) does **not** include `longUrl`, but `PATCH /urls/{id}` requires `longUrl` on every update. The edit form therefore asks the user to re-enter the destination URL rather than pre-filling it.
- `UrlResponse` (returned by the toggle endpoint) doesn't echo back `isActive`, so the dashboard flips its local copy optimistically after a successful toggle call.
- `GET /oauth/callback` is documented as returning `AuthResponse` JSON directly rather than issuing a redirect. This app assumes the OAuth provider's redirect URI is configured to land back on this frontend's `/oauth/callback` route, which then calls the backend endpoint client-side to exchange the code for tokens. If your `mtAuth` configuration instead redirects straight to the backend, update the registered redirect URI to point at the frontend instead.
- There's no documented "confirm password reset with token" endpoint — only `POST /auth/forgot-password` to *start* the flow. The actual reset presumably completes on a page `mtAuth` or the reset email controls; this app only implements the request step.

## Getting started (local development)

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL to point at your backend
npm run dev
```

Runs at `http://localhost:8081`.

### Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Shrimpista Spring Boot backend (build-time default) |
| `VITE_APP_ORIGIN` | This app's own public origin (build-time default) |

In Docker, the equivalent **runtime** variables `API_BASE_URL` / `APP_ORIGIN` take precedence over the build-time values — see below.

### Available scripts

```bash
npm run dev          # start dev server
npm run build         # type-check + production build to dist/
npm run type-check    # tsc only, no emit
npm run lint           # oxlint
npm run preview        # serve the production build locally
```

## Docker

The image is a two-stage build: Node 22 builds static assets, then Nginx 1.27-alpine serves them.

### Why runtime config, not just build args?

Vite normally bakes `VITE_*` variables in at build time. To let the **same built image** be deployed against different backend URLs (staging, prod, a teammate's local backend) without a rebuild, `docker-entrypoint.sh` regenerates `env-config.js` from container environment variables (`API_BASE_URL`, `APP_ORIGIN`) every time the container starts, and the app prefers that over the build-time value.

### Build & run directly

```bash
docker build -t shrimpista-frontend .
docker run -d -p 8080:80 \
  -e API_BASE_URL=https://shrimpista.onrender.com \
  -e APP_ORIGIN=http://localhost:8080 \
  --name shrimpista-frontend \
  shrimpista-frontend
```

Visit `http://localhost:8080`.

### Or with docker-compose

```bash
cp .env.example .env   # optional, compose reads the same var names
docker compose up -d --build
```

Override the backend without rebuilding:

```bash
API_BASE_URL=https://staging.shrimpista.example.com docker compose up -d
```

### Connecting to the Spring Boot backend on the same host

If you're also running the Shrimpista backend (and Postgres/Redis) via Docker Compose, either:

1. Put both compose files on the same external network (set `networks.shrimpista-net.external: true` in `docker-compose.yml` and point it at the backend's network name), or
2. Simply point `API_BASE_URL` at wherever the backend is reachable (a public URL, or `http://host.docker.internal:<port>` for a backend running on the host during local development).

### Health checks

- Container health check: `GET /healthz` → `200 ok`
- Nginx serves the SPA for any unmatched route (`try_files ... /index.html`) so React Router owns client-side routing; only `/assets/*` (fingerprinted, immutable) is cached long-term, while `index.html` and `env-config.js` are always revalidated.

## Project structure

```
src/
  api/          # one file per backend resource (auth, oauth, urls, analytics, admin) + shared axios client
  components/    # reusable UI: Navbar, LinkCard, forms, modals, route guards, etc.
  pages/         # one component per route
  store/         # zustand auth store (persisted JWTs, decoded roles)
  lib/           # formatting/clipboard helpers
  types/         # TypeScript mirrors of the backend's Java records
```

## Design

Dark, deep-sea/bioluminescent visual identity (`#071620` abyss background, coral `#FF6B4D` primary accent, bioluminescent teal `#4FF0C7` secondary accent), Space Grotesk for display type, Inter for body, JetBrains Mono for short codes and timestamps. Short codes render as glowing "creature tag" chips throughout the app as the signature recurring element.
