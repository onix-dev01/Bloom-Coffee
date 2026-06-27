# Bloom Coffee

A coffee-shop ordering app built for the Bloom Growth candidate exercise. Customers browse the menu, customize drinks with add-ons, and submit pickup orders. Admins manage drinks and add-ons behind Supabase auth.

**Stories:** [STORIES.md](STORIES.md) · **Rubric:** [RUBRIC.md](RUBRIC.md)

## Tech stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with shared UI components and Cursor rules
- **Supabase** — email/password auth, PostgreSQL, Row Level Security
- **Vitest** — unit tests for order total logic
- **Deploy target:** Vercel

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

| Variable                        | Description                               |
| ------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key (local seed script only) |

### 3. Run database migrations

In the Supabase SQL editor, run these files in order:

1. [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
2. [`supabase/migrations/002_seed_data.sql`](supabase/migrations/002_seed_data.sql)
3. [`supabase/migrations/003_order_user_id.sql`](supabase/migrations/003_order_user_id.sql)

### 4. Create the admin user

```bash
npm run seed:admin
```

This creates the seed admin and promotes their profile to `admin`.

**Admin credentials:**

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@bloomcoffee.com` |
| Password | `BloomAdmin123!`        |

Sign-up is available on `/admin/login`, but new accounts get the `user` role and cannot access admin routes until promoted.

### 5. Start locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to build an order and [http://localhost:3000/menu](http://localhost:3000/menu) to browse the drink list. Admin access: [http://localhost:3000/login](http://localhost:3000/login).

## Developer notes

Use this section when onboarding a new machine, resetting a Supabase project, or debugging local setup.

### From zero (checklist)

1. Clone the repo and run `npm install`.
2. Create a [Supabase](https://supabase.com) project (or use an existing one).
3. Copy [`.env.example`](.env.example) to `.env.local` and paste your project URL, anon key, and service role key.
4. Run all SQL migrations in order (see [Database migrations](#database-migrations)).
5. Run `npm run seed:admin` to create the seed admin account.
6. Run `npm run dev` and verify customer flow at `/` and admin login at `/login`.

The app reads env vars from `.env.local` at runtime. The seed script also loads `.env` then `.env.local` from the project root if present.

### Supabase project setup

In the Supabase dashboard:

1. **Project Settings → API** — copy `Project URL` and `anon` `public` key into `.env.local`.
2. **Project Settings → API → service_role** — copy the service role key into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`. This key bypasses Row Level Security; it is only used by `scripts/seed-admin.mjs`, never in the Next.js app.
3. **Authentication → Providers → Email** — email/password auth should be enabled (Supabase default).

No Supabase CLI or local Docker stack is required for this project. Migrations are plain SQL files applied through the dashboard.

### Environment variables

| Variable | Required by | Description |
| -------- | ----------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | App + seed script | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | App | Anon/public key (RLS applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | `npm run seed:admin` only | Service role key for creating/promoting the admin user |

On Vercel, set only the two `NEXT_PUBLIC_*` vars. Do not add the service role key to production unless you run the seed script against that project from a secure environment.

### Database migrations

Migration files live in [`supabase/migrations/`](supabase/migrations/). **Always run them in numeric order** on a fresh database:

| File | Purpose |
| ---- | ------- |
| `001_initial_schema.sql` | Tables (`profiles`, `drinks`, `add_ons`, `orders`, …), RLS policies, auth trigger that creates a `profiles` row for new sign-ups |
| `002_seed_data.sql` | Sample drinks and add-ons for local/demo use |
| `003_order_user_id.sql` | Adds `orders.user_id` and policies so signed-in customers can view their order history |

**How to apply (Supabase SQL Editor):**

1. Open your project in Supabase → **SQL Editor** → **New query**.
2. Paste the full contents of `001_initial_schema.sql`, run it, and confirm success.
3. Repeat for `002_seed_data.sql`, then `003_order_user_id.sql`.

Run each file once. Re-running `001` on an existing schema will fail with “already exists” errors.

**Starting over:** In Supabase → **Project Settings → General**, use **Reset database** (or create a new project), then run all three migrations again and re-run `npm run seed:admin`.

**Adding a new migration:** Add `004_description.sql` (or the next number) under `supabase/migrations/`, document it in this README, and apply it through the SQL Editor on every environment (local Supabase project, production, etc.).

### Admin user and roles

- `npm run seed:admin` creates `admin@bloomcoffee.com` (if missing) and sets `profiles.role = 'admin'`.
- New sign-ups via `/login` get `role = 'user'` from the `handle_new_user` trigger in `001_initial_schema.sql`.
- Admin routes are gated in middleware; only `profiles.role = 'admin'` passes. RLS on writes uses the same `is_admin()` helper.

To promote another user manually: Supabase → **Table Editor → profiles** → set `role` to `admin` for that user’s row.

### Day-to-day development

```bash
npm run dev          # Next.js dev server (http://localhost:3000)
npm run lint         # ESLint
npm test             # Vitest (order total logic)
npm run test:watch   # Vitest in watch mode
npm run build        # Production build (run before deploy)
```

After changing admin menu data (drinks or add-ons), customer routes `/` and `/order` are revalidated automatically via Server Actions. If something looks stale during dev, hard-refresh the browser.

**Useful paths:**

- Server Actions: colocated `actions.ts` under each route in `src/app/`
- Shared types: `src/lib/types.ts`
- Supabase clients: `src/lib/supabase/client.ts` (browser), `server.ts` (RSC/actions)
- Auth middleware: `src/middleware.ts`

### Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| App crashes on load with missing env error | `.env.local` not set or dev server not restarted after editing env | Add vars from `.env.example`, restart `npm run dev` |
| `seed:admin` fails with missing key | `SUPABASE_SERVICE_ROLE_KEY` not in `.env.local` | Copy service role key from Supabase API settings |
| Admin login works but `/admin/*` redirects | Profile still `user` | Run `npm run seed:admin` or set `profiles.role` to `admin` |
| Empty menu | Migrations not run or `002` skipped | Run `001` then `002` in the SQL Editor |
| Order history empty when signed in | `003_order_user_id.sql` not applied | Run migration `003` |
| SQL errors when re-running `001` | Schema already exists | Reset database or only run new migration files |

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Production build               |
| `npm run start`      | Start production server        |
| `npm run lint`       | Run ESLint                     |
| `npm test`           | Run Vitest unit tests          |
| `npm run test:watch` | Run Vitest in watch mode       |
| `npm run seed:admin` | Create/promote seed admin user |

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy. Run migrations and `npm run seed:admin` against your production Supabase project.

**Live URL:** https://bloom-coffee-eight.vercel.app/

## Routes

| Route                     | Access    | Description                      |
| ------------------------- | --------- | -------------------------------- |
| `/`                       | Public    | Order builder with running total |
| `/menu`                   | Public    | Drink menu                       |
| `/order`                  | Public    | Redirects to `/`                 |
| `/orders`                 | Signed-in | Your order history               |
| `/order/confirmation?id=` | Public    | Order confirmation               |
| `/login`                  | Public    | Staff sign in / sign up          |
| `/admin/login`            | Public    | Redirects to `/login`            |
| `/admin`                  | Admin     | Redirects to orders              |
| `/admin/orders`           | Admin     | Recent customer orders           |
| `/admin/drinks`           | Admin     | Drinks CRUD                      |
| `/admin/add-ons`          | Admin     | Add-ons CRUD                     |

## Trade-offs

- **Server Actions over REST** — less boilerplate for this scope; RLS still enforces authorization.
- **Admin role in `profiles`** — sign-up is enabled, but only `admin` role users pass middleware.
- **Client-side cart until submit** — customers need no account; order persists on submit only. Sign in to save orders to your history.
- **Price snapshots on orders** — drink/add-on names and prices are stored on each order so totals stay correct if the menu changes later.

## Testing

Order math is covered by unit tests:

```bash
npm test
```

Tests live in [`__tests__/order-utils.test.ts`](__tests__/order-utils.test.ts).

## Project structure

```
src/
├── app/                 # Routes and Server Actions
├── components/ui/       # Reusable Tailwind UI primitives
├── components/auth/     # Admin login layout and forms
├── components/admin/    # Admin CRUD UI
├── components/customer/ # Menu and order flow
└── lib/                 # Supabase clients, types, order utils
supabase/migrations/     # SQL schema and seed data
.cursor/rules/           # Cursor AI conventions
```

---
