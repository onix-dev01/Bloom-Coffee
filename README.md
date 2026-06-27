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

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (local seed script only) |

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

| Field | Value |
|-------|-------|
| Email | `admin@bloomcoffee.com` |
| Password | `BloomAdmin123!` |

Sign-up is available on `/admin/login`, but new accounts get the `user` role and cannot access admin routes until promoted.

### 5. Start locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to build an order and [http://localhost:3000/menu](http://localhost:3000/menu) to browse the drink list. Admin access: [http://localhost:3000/login](http://localhost:3000/login).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run seed:admin` | Create/promote seed admin user |

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy. Run migrations and `npm run seed:admin` against your production Supabase project.

**Live URL:** _Add your Vercel deployment URL here after deploying._

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Order builder with running total |
| `/menu` | Public | Drink menu |
| `/order` | Public | Redirects to `/` |
| `/orders` | Signed-in | Your order history |
| `/order/confirmation?id=` | Public | Order confirmation |
| `/login` | Public | Staff sign in / sign up |
| `/admin/login` | Public | Redirects to `/login` |
| `/admin` | Admin | Redirects to orders |
| `/admin/orders` | Admin | Recent customer orders |
| `/admin/drinks` | Admin | Drinks CRUD |
| `/admin/add-ons` | Admin | Add-ons CRUD |

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

See [README submission section](#) above for Bloom Growth review instructions (private repo, PR, invite reviewer).
