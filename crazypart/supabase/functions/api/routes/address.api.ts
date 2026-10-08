/**
 * ADDRESSES API ARCHITECTURE & SECURITY EXPLANATION
 *
 * Why a custom Edge Function API route is NOT required:
 * Address management (fetching saved addresses, creating new addresses, setting default address, deleting an address)
 * is executed directly from the frontend UI via Supabase JS SDK (`accountService.ts`) and protected by PostgreSQL
 * Row Level Security (RLS) policies (`addresses_owner_all`).
 *
 * Security & Data Integrity Rules:
 *
 * 1. Owner Isolation (`addresses_owner_all` RLS Policy):
 *    - All operations (SELECT, INSERT, UPDATE, DELETE) enforce `user_id = auth.uid()`.
 *    - Users can never view or tamper with another customer's stored delivery addresses.
 *
 * 2. Unified Identity Across Login Methods (Gmail OAuth & Password Auth):
 *    - Addresses are bound strictly to `user_id` referencing `auth.users(id)`.
 *    - If a user first checks out / signs in via Google OAuth (`user@gmail.com`) and later creates an account with password
 *      using the same email address, Supabase Auth links both authentication methods under the single `auth.users.id`.
 *    - As a result, all saved addresses automatically remain accessible under the user's account regardless of which login method they use.
 *
 * 3. Immutable Order Snapshots:
 *    - When an order is placed, the chosen delivery address details are snapshotted directly into `orders.shipping_address` (JSONB).
 *    - This ensures that if a user updates or deletes a saved address in `public.addresses`, historical order records remain unchanged.
 */

export {};


