# Crazy Cut Piece

Crazy Cut Piece is a React and Vite storefront backed by Supabase PostgreSQL, Auth, and Storage.

## Requirements

- Node.js 20+
- npm
- A Supabase project, or the Supabase CLI for local services

## Frontend setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set:

   ```text
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   ```

3. Start Vite:

   ```bash
   npm run dev
   ```

The public storefront remains available without Supabase variables, but authentication and database features require them.

## Supabase

Database migrations live in `supabase/migrations`. Apply them through the Supabase CLI or the project's deployment pipeline. Generate database types after schema changes and commit the generated type file.

Google OAuth must be enabled in Supabase Auth. Add both the production callback URL and `http://localhost:5173/auth/callback` to the redirect allowlist.

Never expose the Supabase secret/service-role key or Razorpay secrets through `VITE_` environment variables.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

The Vite output is written to `dist` and can be deployed to a static host. Configure SPA fallback routing to `index.html`, set the two public Supabase variables, apply database migrations before releases that depend on them, and deploy Edge Functions separately when introduced.
