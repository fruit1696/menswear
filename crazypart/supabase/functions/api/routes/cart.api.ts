/**
 * CART API ARCHITECTURE & PRICE TAMPERING PROTECTION
 *
 * Why a custom Edge Function API route is NOT required for Cart CRUD:
 * Shopping cart operations (fetching cart, adding items, updating quantities, removing items) are
 * executed directly from the frontend UI via Supabase JS SDK (`src/features/cart/cartService.ts`)
 * and protected by PostgreSQL Row Level Security (RLS) policies (`carts_owner_all`, `cart_items_owner_all`).
 *
 * Security & Price Integrity Enforcements:
 *
 * 1. Absence of Client-Side Price Columns:
 *    - The `public.cart_items` table schema contains ONLY `(id, cart_id, product_id, quantity)`.
 *    - There is NO `price` or `unit_price` column in `cart_items`.
 *    - A client cannot insert or manipulate item prices (e.g. setting price to $0.00 in browser console).
 *
 * 2. Authoritative PostgreSQL Pricing:
 *    - Item prices are stored strictly in `public.products.price_paise` in PostgreSQL.
 *    - When creating an order, the server-side Checkout Edge Function (`checkout.api.ts`) fetches
 *      `products.price_paise` directly from the database using service-role privileges, completely
 *      ignoring any client-asserted pricing.
 *
 * 3. Quantity Validation (`CHECK` Constraint):
 *    - Enforced at DB level: `CHECK (quantity > 0 AND quantity <= 50)`.
 *    - Prevents negative quantities, 0-quantity items, or arbitrary bulk inflation attacks.
 *
 * 4. Guest & Auth Syncing:
 *    - Unauthenticated/guest users store cart state in browser `localStorage` (`cartStorage.js`).
 *    - Upon user login, local cart items are merged directly into `public.carts` and `public.cart_items`
 *      for the authenticated `user_id`.
 */

export {};

