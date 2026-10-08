/**
 * PRODUCT CATALOG API ARCHITECTURE & SECURITY EXPLANATION
 *
 * Why a custom Edge Function API route is NOT required:
 * Product catalog browsing (listing active products, fetching details by slug, image retrieval) is
 * executed directly from the frontend UI via Supabase JS SDK (`src/features/products/productService.ts`)
 * and protected by PostgreSQL Row Level Security (RLS) policies (`products_public_read`, `product_images_public_read`).
 *
 * Security & Data Integrity Enforcements:
 *
 * 1. Public Read Security (`products_public_read` RLS Policy):
 *    - Anonymous and authenticated users can query `public.products` where `status = 'active'`.
 *    - Draft or archived products are hidden at the database layer from non-admin users.
 *
 * 2. High Performance & CDN Caching:
 *    - Direct PostgREST queries leverage Supabase API Gateway CDN caching for public catalog data.
 *    - Combined with TanStack Query on the client side (`productQueries.ts`), product lists and detail pages
 *      load instantly without edge function execution cold-start delays.
 *
 * 3. Admin Mutations (`private.is_admin()` RLS Policy):
 *    - Creating, updating, or deleting products/inventory is restricted to authenticated admin users (`role = 'admin'`).
 *    - Admin writes can be performed directly via the Supabase Admin Portal or authenticated JS SDK calls.
 */

export {};

