# AGENTS.md

## Project context

This is the Crazy Cut Piece React/Vite storefront. Supabase provides PostgreSQL, Auth, Storage, and privileged Edge Functions. Follow `ARCHITECTURE.md` for all engineering decisions.

## Engineering rules

- Preserve the existing frontend design, typography, responsive behavior, public pages, and policy pages.
- Keep presentation, business rules, data access, and infrastructure concerns separate.
- Use TanStack Query for server state and local React state for local UI concerns.
- Keep PostgreSQL authoritative for prices, stock, orders, and payment state.
- Enable and test RLS for every exposed table.
- Never expose Supabase secret/service-role keys or Razorpay secrets in frontend code.
- Add schema changes as versioned files under `supabase/migrations`.
- Prefer focused feature services over a large generic abstraction around Supabase.
- Run the relevant lint, type-check, test, and build commands before finishing changes.

## Key paths

- `src/`: frontend source
- `src/api/supabaseClient.ts`: browser Supabase client
- `src/components/ui/`: established UI primitives
- `src/index.css`: design tokens and typography
- `supabase/migrations/`: PostgreSQL schema and policies
- `.env.local`: local secrets and configuration; never commit it
