/**
 * REVIEWS API ARCHITECTURE & VERIFIED PURCHASE ENFORCEMENT
 *
 * Why a custom Edge Function API route is NOT required:
 * Review operations (CRUD) are executed directly from the frontend using the Supabase JS SDK
 * (`supabase.from('reviews')`), leveraging PostgreSQL Row Level Security (RLS) policies and triggers.
 *
 * Security & Data Integrity Enforcements (defined in `supabase/migrations/202609100002_product_reviews.sql`):
 *
 * 1. Verified Purchase Check (`reviews_verified_customer_insert` RLS Policy):
 *    - Only authenticated users (`auth.uid()`) can insert reviews.
 *    - The insertion requires linking a valid `order_id` and `product_id`.
 *    - RLS verifies that an order exists where `o.id = order_id`, `o.user_id = auth.uid()`,
 *      the product exists in `order_items`, AND the order status is in ('paid', 'processing', 'shipped', 'delivered').
 *    - Unverified users or users who have not purchased the item are blocked at the database layer.
 *
 * 2. One Review Per Product (`unique(user_id, product_id)` Constraint):
 *    - Prevents spam or duplicate reviews by strictly limiting users to one review per product.
 *
 * 3. Automatic Author Naming (`set_review_author_name` Trigger):
 *    - Before insert or update, PostgreSQL automatically pulls `full_name` from `public.profiles`
 *      matching `new.user_id`, defaulting to 'Customer' if unprovided.
 *
 * 4. Content Validation Constraints:
 *    - `rating`: Enforced `CHECK (rating BETWEEN 1 AND 5)`.
 *    - `review_text`: Enforced `CHECK (char_length(trim(review_text)) BETWEEN 10 AND 2000)`.
 *
 * 5. Update & Delete Protection (`reviews_owner_update` & `reviews_owner_delete` RLS Policies):
 *    - Users can only modify or remove reviews where `user_id = auth.uid()`.
 *
 * 6. Public Read Access (`reviews_public_read` RLS Policy):
 *    - Anonymous and authenticated users can view product reviews (`SELECT`).
 */

export {};


