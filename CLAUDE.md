# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack portfolio site: React 19 (Vite, TypeScript, Redux Toolkit + RTK Query, MUI) on
the frontend, Vercel serverless functions + Neon Postgres on the backend, EmailJS for the
contact form, and Cloudflare for hosting the resume PDF / project & certificate images.

Every piece of public content (home intro, about, skills, experience, projects,
certifications, contact info) is stored in Neon and edited through a password-protected
`/admin` dashboard — no redeploy needed to update content.

## Commands

```bash
npm run dev        # Vite dev server only (frontend, port 5173) — /api calls need `vercel dev` running too
npm run build       # tsc -b (project references) then vite build
npm run lint         # oxlint
npm run preview     # preview the production build
```

There is no test suite configured in this repo.

### Running the full stack locally

The frontend and the `/api` serverless functions are separate processes locally. Preferred:

```bash
npm install -g vercel   # once
vercel dev              # serves frontend + /api together, usually on :3000
```

Or run them separately — Vite proxies `/api/*` to `http://localhost:3000` (configured in
[vite.config.ts](vite.config.ts)):

```bash
vercel dev     # terminal 1
npm run dev    # terminal 2, open the :5173 URL
```

Requires `.env` (copy from `.env.example`): `DATABASE_URL` (Neon pooled connection string),
`JWT_SECRET`, and `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` /
`VITE_EMAILJS_PUBLIC_KEY`. `VITE_*` vars are baked into the client bundle at build time;
the others stay server-side only.

## Architecture

### Backend: one file per resource, Neon accessed directly

Every file in [api/](api/) is a Vercel serverless function exporting a single
`handler(req, res)`. There's no framework/router beyond Vercel's file-based routing — the
filename *is* the route (`api/skills.ts` → `/api/skills`).

Every handler follows the same shape (see [api/home.ts](api/home.ts) as the simplest
example):
1. `if (handlePreflight(req, res)) return;` — CORS + OPTIONS handling ([api/_lib/http.ts](api/_lib/http.ts))
2. Branch on `req.method`. GET is public; mutating methods call
   `verifyAdminRequest(req)` ([api/_lib/auth.ts](api/_lib/auth.ts)) and `return unauthorized(res)` if it fails
3. Run tagged-template SQL via `sql` from [api/_lib/db.ts](api/_lib/db.ts) (`@neondatabase/serverless`)
4. `catch (err) { return serverError(res, err); }`

**Multi-entity resources** (skills, experience) handle more than one DB table behind a
single endpoint using a body/query `entity` discriminator instead of separate routes —
e.g. `POST /api/skills { entity: 'category' | 'skill', ... }`,
`DELETE /api/experience?entity=company|project&id=`. When adding CRUD for a new resource,
follow this pattern rather than introducing new files for sub-entities.

Auth: a single hardcoded admin row in `admin_users` (seeded by
[database/schema.sql](database/schema.sql)), checked in [api/auth/login.ts](api/auth/login.ts) and signed into a 12h JWT.
**The password is intentionally stored and compared in plain text** — a known, deliberate
simplification for this project (see README §7), not an oversight to silently "fix".
`verifyAdminRequest` reads `Authorization: Bearer <token>` on every protected mutation.

### Frontend: RTK Query is the only data layer

[src/features/api/apiSlice.ts](src/features/api/apiSlice.ts) defines **every** API call as one `createApi` instance —
one endpoint per backend route/entity, each declaring its `providesTags`/`invalidatesTags`.
Pages and admin tabs call the generated `useXQuery`/`useXMutation` hooks directly; there is
no separate service/fetch layer. When adding a backend field or resource, update the
matching endpoint (and the shared types in [src/types/index.ts](src/types/index.ts)) here first.

Redux store ([src/app/store.ts](src/app/store.ts)) has three slices: `api` (RTK Query cache), `auth`
(JWT + username, persisted to `localStorage` under `admin-token`/`admin-username`,
see [src/features/auth/authSlice.ts](src/features/auth/authSlice.ts)), and `ui` (theme mode). `/admin` is gated by
[src/components/common/ProtectedRoute.tsx](src/components/common/ProtectedRoute.tsx), which just checks `auth.token` is truthy and
redirects to `/signin` — it does not verify the JWT client-side.

**Admin CRUD tabs** ([src/pages/admin/](src/pages/admin/)) are built from two generic pieces rather than
bespoke forms per resource: [src/components/admin/EntityDialog.tsx](src/components/admin/EntityDialog.tsx) (a config-driven
add/edit dialog — pass a `FieldConfig[]` describing field names/types) and
[src/components/admin/AdminListRow.tsx](src/components/admin/AdminListRow.tsx). Follow this pattern for new admin tabs instead of
writing a one-off `<Dialog>`.

Routing is flat, declared in [src/App.tsx](src/App.tsx): public pages under `<Layout />`, `/admin`
wrapped in `<ProtectedRoute />`. In dev, `/api` requests are proxied to `vercel dev` on
`:3000` ([vite.config.ts](vite.config.ts)); in prod they're served from the same Vercel deployment, so
`apiSlice`'s `baseUrl` is always the relative `/api`.

### Data model

Content tables in Neon, all defined in [database/schema.sql](database/schema.sql):
`home_profile`, `about_me` + `achievements`, `skill_categories` + `skills`,
`experiences` + `experience_projects` (nested), `projects`, `certifications`,
`contact_info` + `contact_messages`, `site_settings`, `admin_users`.

File storage (resume PDF, project screenshots, certificate images) is **not** handled by
this app — Cloudflare-hosted URLs are pasted directly into admin form fields.

## Conventions

- API responses shape errors as `{ error: string }`; the frontend has no shared error
  parsing beyond what RTK Query provides.
- SQL uses `@neondatabase/serverless`'s tagged-template `sql` — always parameterize via the
  template literal, never string-concatenate into a query.
- `COALESCE(${field}, field)` is the standard pattern for partial-update PUT endpoints —
  omit a field in the request body to leave it unchanged.
