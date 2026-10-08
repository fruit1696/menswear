/**
 * PROFILE API ARCHITECTURE & IDENTITY LINKING EXPLANATION
 *
 * Why a custom Edge Function API route is NOT required:
 * Profile management (fetching user profiles, updating full name, phone number, avatar URL)
 * is executed directly from the frontend UI via Supabase JS SDK (`accountService.ts`) and
 * protected by Row Level Security (RLS) policies (`profiles_select_own`, `profiles_update_own`).
 *
 * Key Design Principles & Security Rules:
 *
 * 1. Email Immutability on Profile:
 *    - The `email` field is managed exclusively by Supabase Auth (`auth.users`) and is read-only on `public.profiles`.
 *    - Direct updates to `email` via profile API are disallowed. Email modifications must go through
 *      `supabase.auth.updateUser({ email })` which sends email verification links to enforce security.
 *
 * 2. Identity Linking Scenario (Gmail OAuth -> Later Email/Password Registration):
 *    - **Initial Visit**: A customer logs in or purchases using "Sign in with Google" (e.g. `user@gmail.com`).
 *      Supabase Auth creates an entry in `auth.users` with `id = UUID_A` and `email = user@gmail.com`.
 *      The `on_auth_user_created` DB trigger automatically creates a matching row in `public.profiles` with `id = UUID_A`.
 *    - **Subsequent Visit**: The same customer visits later and chooses "Create Account / Sign Up" using Email & Password
 *      with the same `user@gmail.com`.
 *    - **How Supabase Handles Linking**:
 *      Supabase Auth matches `user@gmail.com` in `auth.users`. When automatic identity linking (or email confirmation)
 *      is active, Supabase attaches the new password identity provider to the existing `auth.users` record (`id = UUID_A`).
 *    - **Seamless Continuity**: Because the primary `auth.users.id` remains `UUID_A`, all past orders (`orders.user_id = UUID_A`),
 *      saved shipping addresses (`addresses.user_id = UUID_A`), product reviews (`reviews.user_id = UUID_A`), and profile state
 *      automatically remain connected to the user without requiring manual data migrations or custom backend APIs.
 */

export {};


