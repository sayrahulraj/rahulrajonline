# Rahul Raj Online — Portfolio

A full-stack portfolio site: React 18+ (Vite, TypeScript, Redux Toolkit, MUI) on the
frontend, Vercel serverless functions + Neon Postgres on the backend, EmailJS for the
contact form, and Cloudflare for hosting the resume PDF / project & certificate images.

Every piece of content (home intro, about, skills, experience, projects, certifications,
contact info) is driven from Neon and editable through a password-protected `/admin`
dashboard — no redeploy needed to update content.

---

## 1. Stack

| Layer          | Technology                                              |
|----------------|----------------------------------------------------------|
| Frontend       | React 18+, Vite, TypeScript, Redux Toolkit (+ RTK Query), MUI |
| Backend        | Vercel Serverless Functions (Node/TypeScript, `/api`)   |
| Database       | Neon (serverless Postgres)                              |
| Auth           | JWT-signed session, single admin user checked against Neon |
| Email          | EmailJS (contact form, sent client-side)                 |
| File storage   | Cloudflare (R2 or Pages) for resume PDF & images — you paste the resulting URLs into the admin dashboard |
| Hosting        | Vercel                                                    |

---

## 2. One-time setup

### 2.1 Neon database

1. Create a project at [neon.tech](https://neon.tech).
2. Open the SQL editor and run **`database/schema.sql`** from this repo. It creates every
   table and seeds:
   - the admin login (`rahulraj.ai` / `RudraDev`, stored in plain text as requested — see
     the security note below)
   - a starter `home_profile` row so the homepage isn't empty on first load
3. Copy the **pooled connection string** (Dashboard → your project → Connection Details).

### 2.2 EmailJS

1. Create an account at [emailjs.com](https://www.emailjs.com).
2. Add an Email Service (e.g. Gmail) and note the **Service ID**.
3. Create an Email Template with merge fields `{{from_name}}`, `{{reply_to}}`,
   `{{subject}}`, `{{message}}` and note the **Template ID**.
4. Copy your **Public Key** from Account → API Keys.

### 2.3 Cloudflare (for the resume PDF, project screenshots, certificate images)

Upload your resume PDF and any images to Cloudflare R2 (or Cloudflare Pages / Images) and
make them publicly accessible. You'll paste the resulting URLs into the admin dashboard —
this project doesn't build a file-upload flow, it expects ready-made public URLs.

### 2.4 Environment variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — your Neon pooled connection string
- `JWT_SECRET` — any long random string
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` — from EmailJS

When you deploy to Vercel, add the same variables under **Project Settings → Environment
Variables** (the `VITE_*` ones will be baked into the client bundle at build time; the
others stay server-side).

---

## 3. Running locally

This project has two parts that both need to run: the Vite frontend and the Vercel
serverless functions in `/api`. The easiest way is the Vercel CLI, which serves both
together:

```bash
npm install
npm install -g vercel      # if you don't have it
vercel dev
```

This serves the frontend **and** `/api/*` on the same local port (usually `http://localhost:3000`).

Alternatively, run Vite and `vercel dev` separately (Vite proxies `/api` to
`http://localhost:3000`, already configured in `vite.config.ts`):

```bash
# terminal 1
vercel dev

# terminal 2
npm run dev
```

Then open the Vite URL (usually `http://localhost:5173`).

---

## 4. Signing in and adding your content

1. Go to `/signin`.
2. Log in with the credentials seeded in `database/schema.sql`:
   - Username: `rahulraj.ai`
   - Password: `RudraDev`
3. You'll land on `/admin`, a tabbed dashboard covering Home, About, Skills, Experience,
   Projects, Certifications, and Contact. Every tab reads/writes straight to Neon —
   changes appear on the public site immediately, no rebuild required.
4. **Change the admin password** by updating the `admin_users` table in Neon once you're
   set up (see security note below).

---

## 5. Deploying to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Import it in [vercel.com/new](https://vercel.com/new). Vercel auto-detects the Vite
   framework and the `/api` functions.
3. Add the environment variables from step 2.4 in Project Settings.
4. Deploy. Your site and API are now live on the same domain — no separate backend hosting
   needed.

---

## 6. Project structure

```
api/                     Vercel serverless functions (Neon-backed REST API)
  _lib/                  shared db/auth/http helpers
  auth/login.ts          admin sign-in
  home.ts, about.ts, achievements.ts, skills.ts, experience.ts,
  projects.ts, certifications.ts, contact-info.ts,
  contact-messages.ts, settings.ts

database/
  schema.sql             run this once against Neon

src/
  app/                   Redux store + typed hooks
  features/
    auth/                admin session slice
    ui/                  theme (dark/light) slice
    api/                 RTK Query endpoints for every resource
  theme/                 MUI theme + design tokens
  components/
    layout/              Navbar, Footer, Layout
    common/               shared UI (SectionHeading, ProtectedRoute, BackToTop)
    home/                 TerminalSkillRotator (animated hero visual)
    admin/                EntityDialog, AdminListRow (generic CRUD building blocks)
  pages/                  Home, About, Skills, Experience, Projects,
                          Certifications, Contact, SignIn, NotFound
  pages/admin/            AdminDashboard + one tab per resource
  utils/                  date formatting, EmailJS wrapper
```

---

## 7. Security note

Per the project requirements, the admin username/password are stored in **plain text** in
the `admin_users` table and compared directly on login. This is intentionally simple but
is **not a best practice** for production systems handling anything sensitive. If you want
to harden it later: hash the password with bcrypt before storing it, compare with
`bcrypt.compare()` in `api/auth/login.ts`, and rotate `JWT_SECRET` periodically.

---

## 8. Content model (what lives in Neon)

- **`home_profile`** — greeting, name, role, interest line, summary, resume/GitHub/LinkedIn/email links, rotating skill list for the animated hero
- **`about_me`** + **`achievements`** — passion statement, career journey text, achievement cards
- **`skill_categories`** + **`skills`** — the 9 grouped stacks (Language & Framework, Architecture & Integration, Frontend Development, API Security & Documentation, Data & Caching, DevOps & CI/CD, Testing & Quality, Agile Collaboration, AI-Augmented Engineering)
- **`experiences`** + **`experience_projects`** — companies, roles, date ranges, domain, and nested projects with responsibilities/achievements/tech stack
- **`projects`** — standalone portfolio projects with photo, description, tech stack, GitHub link
- **`certifications`** — name, issuer, image, completion/expiry dates, certificate link
- **`contact_info`** + **`contact_messages`** — public contact details/map coordinates, plus a durable log of every message submitted through the form
- **`site_settings`** — resume PDF URL
