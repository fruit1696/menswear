# 1. Final recommended architecture

Use a Supabase-centered modular monolith:

```text
React + Vite SPA
├── Public storefront
├── Customer account/cart/wishlist
└── Admin UI
        │
        ├── Supabase Auth
        ├── Supabase Data API with RLS
        ├── Supabase Storage
        └── Supabase Edge Functions
                └── Razorpay API/webhooks
                         │
                    PostgreSQL
```

Responsibilities:

- React renders the established UI and coordinates user actions.
- TanStack Query manages remote/server state.
- Supabase Auth owns identity and session lifecycle.
- PostgreSQL is authoritative for products, prices, inventory, carts and orders.
- RLS enforces customer/admin data access.
- PostgreSQL functions handle atomic stock/order operations.
- Edge Functions handle Razorpay secrets, external API calls and webhook verification.
- Zod validates forms and Edge Function request boundaries.
- Existing design, public routes and WhatsApp experience remain intact.

No Express, Fastify, Prisma, Drizzle, microservices or separate Node API is needed.

# 2. Final technology stack

| Concern | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router |
| Styling | Tailwind CSS and existing design tokens |
| UI components | Existing shadcn/Radix components |
| Server-state | TanStack Query |
| Forms | React Hook Form where useful |
| Validation | Zod |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth with Google OAuth |
| Authorization | PostgreSQL grants, RLS and an admin-check function |
| File storage | Supabase Storage |
| Server logic | PostgreSQL functions and minimal Supabase Edge Functions |
| Payments | Razorpay Standard Checkout |
| Database types | Supabase-generated TypeScript types |
| Testing | Vitest, Testing Library and later Playwright |
| Deployment | Static frontend host + Supabase managed backend |

Required new runtime dependency:

- `@supabase/supabase-js`

Existing Stripe dependencies should be removed because Razorpay is the chosen provider.

The Razorpay browser checkout can be loaded from Razorpay’s official checkout script; a frontend Razorpay secret or server SDK is not required.

# 3. Final database schema

Products do not currently require variants. Each displayed fabric/cut-piece is one independently priced and stocked SKU. Variants should only be introduced later if a single product gains multiple purchasable sizes, lengths or colors with separate SKUs.

Prices use integer paise, not strings or floating-point values.

## `profiles`

Purpose: application-level information associated one-to-one with `auth.users`.

Key fields:

```text
id uuid PK → auth.users.id
full_name text
phone text
role text: customer | admin
created_at timestamptz
updated_at timestamptz
```

Access:

- Customer: read and update their profile, except `role`.
- Admin: read profiles as operationally required.
- Anonymous: no access.
- Role changes: trusted SQL/admin operation only.

A database trigger creates the profile when an Auth user is created.

## `products`

Purpose: canonical purchasable catalog.

```text
id uuid PK
name text
slug text UNIQUE
description text
price_paise bigint CHECK >= 0
sku text UNIQUE
category text
fabric_type text
color text
pattern text
status text: draft | active | archived
created_at timestamptz
updated_at timestamptz
```

Access:

- Anonymous/authenticated: read active products only.
- Admin: read all and create/update/archive.
- Customers: no direct writes.
- Products should normally be archived rather than deleted.

Inventory is not stored here because it requires a separately protected, frequently updated row.

## `product_images`

Purpose: ordered image metadata separate from products.

```text
id uuid PK
product_id uuid FK → products.id
object_path text UNIQUE
alt_text text
sort_order integer
is_primary boolean
created_at timestamptz
```

Access:

- Public: read images belonging to active products.
- Admin: create/update/delete.
- Customers: no writes.

## `inventory`

Purpose: authoritative stock for each product.

```text
product_id uuid PK/FK → products.id
stock_quantity integer CHECK >= 0
updated_at timestamptz
```

Access:

- Public/customer: no direct table access.
- Admin: read and adjust through an audited admin operation.
- Checkout functions: privileged transactional access.

The public catalog can expose a safe `in_stock` boolean through a security-invoker view or narrowly scoped function without revealing exact quantities.

## `wishlists`

Purpose: simplest user-based wishlist.

```text
user_id uuid FK → auth.users.id
product_id uuid FK → products.id
created_at timestamptz
PRIMARY KEY (user_id, product_id)
```

Access:

- Authenticated owner: read/create/delete their entries.
- Anonymous: none.
- Admin: ordinarily unnecessary.

## `carts`

Purpose: persisted authenticated shopping carts.

```text
id uuid PK
user_id uuid FK → auth.users.id
status text: active | converted | abandoned
created_at timestamptz
updated_at timestamptz
```

Use a partial unique index allowing one active cart per user.

Access:

- Owner: read their cart.
- Creation/update: owner under RLS or narrow cart functions.
- Admin: no routine access required.

## `cart_items`

Purpose: product quantities in a cart.

```text
id uuid PK
cart_id uuid FK → carts.id
product_id uuid FK → products.id
quantity integer CHECK quantity > 0
created_at timestamptz
updated_at timestamptz
UNIQUE (cart_id, product_id)
```

Access:

- Owner of parent cart: read/create/update/delete.
- Browser values are preferences only; price and stock are revalidated during checkout.

## `addresses`

Purpose: saved customer delivery addresses.

```text
id uuid PK
user_id uuid FK → auth.users.id
recipient_name text
phone text
line1 text
line2 text nullable
city text
state text
postal_code text
country_code text default 'IN'
is_default boolean
created_at timestamptz
updated_at timestamptz
```

Access:

- Owner: CRUD their addresses.
- Anonymous: none.
- Admin: no general direct access; fulfillment uses the immutable order snapshot.

## `orders`

Purpose: checkout, payment and fulfillment authority.

```text
id uuid PK
order_number text UNIQUE
user_id uuid FK → auth.users.id
status text
subtotal_paise bigint
shipping_paise bigint
total_paise bigint
currency text default 'INR'
shipping_address jsonb
razorpay_order_id text UNIQUE nullable
stock_allocated boolean default false
stock_released boolean default false
expires_at timestamptz nullable
paid_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

Statuses:

```text
pending_payment
paid
payment_failed
cancelled
processing
shipped
delivered
refunded
```

Access:

- Customer: read their own orders.
- Browser: no direct insert/update.
- Edge/database functions: create and perform valid state transitions.
- Admin: read all; use controlled operations for fulfillment transitions.

## `order_items`

Purpose: immutable purchase snapshot.

```text
id uuid PK
order_id uuid FK → orders.id
product_id uuid nullable
product_name text
sku text
category text
fabric_type text
color text
pattern text
unit_price_paise bigint
quantity integer
line_total_paise bigint
```

Access:

- Customer: read items belonging to their orders.
- Browser: no writes.
- Admin: read.
- Checkout function: create.

Names, attributes and prices remain historically accurate even if the product changes.

## `payments`

Purpose: Razorpay payment attempts and idempotent verification.

```text
id uuid PK
order_id uuid FK → orders.id
provider text default 'razorpay'
razorpay_order_id text
razorpay_payment_id text UNIQUE nullable
webhook_event_id text UNIQUE nullable
amount_paise bigint
currency text
status text: created | authorized | captured | failed | refunded
verified_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

Do not store card details or unnecessary raw payment payloads.

Access:

- Customer: optionally read limited status fields for their order.
- Browser: no writes.
- Edge Functions: privileged writes.
- Admin: read.

No additional inventory-reservation table is initially needed.

# 4. RLS and security strategy

Enable RLS on every exposed table. Supabase explicitly recommends RLS for tables exposed through its Data API. The publishable key is safe in the frontend only when grants and RLS are correct. [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)

Access matrix:

| Data | Anonymous | Customer | Admin |
|---|---:|---:|---:|
| Active products/images | Read | Read | CRUD |
| Draft/archived products | No | No | Read/write |
| Exact inventory | No | No | Read/adjust |
| Availability boolean | Read | Read | Read |
| Profile | No | Own | Operational read |
| Wishlist | No | Own CRUD | Normally no access |
| Cart/items | No | Own CRUD | Normally no access |
| Addresses | No | Own CRUD | No general access |
| Orders/items | No | Own read | Read/manage |
| Payments | No | Own limited read | Read |
| Storage product images | Public read | Public read | Upload/update/delete |

Admin authorization:

- Store the role in `profiles.role`.
- Customers cannot update that column.
- Use a small `private.is_admin()` SQL function in RLS policies.
- If `SECURITY DEFINER` is required, place it in an unexposed schema, set `search_path = ''`, schema-qualify every reference, and revoke default execution permissions. [Supabase database-function security](https://supabase.com/docs/guides/database/functions)
- Initial admins are assigned through a trusted SQL/dashboard operation.
- Never trust an `isAdmin` flag sent by React.

The Supabase service-role/secret key is restricted to Edge Functions and deployment tooling. It must never use a `VITE_` prefix.

# 5. Authentication flow

Use Supabase Auth’s Google provider directly.

```text
User selects Sign in with Google
→ supabase.auth.signInWithOAuth({ provider: 'google' })
→ Google consent
→ Supabase callback
→ approved application callback URL
→ Supabase session initialized
→ AuthProvider receives auth-state event
→ profile and cart queries load
```

Supabase requires the Google client configuration, its callback URI and application redirect allowlist to be configured correctly. [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

Frontend session handling:

- One Supabase browser client.
- An `AuthProvider` calls `getSession()` initially.
- Subscribe once with `onAuthStateChange`.
- Store `session`, `user`, loading state and profile in React context/query state.
- Unsubscribe on provider cleanup.
- Do not manually read, write or copy access/refresh tokens.
- Do not store Google provider tokens.
- Let the Supabase SDK manage SPA session persistence and refresh.
- RLS uses `auth.uid()`, not frontend identity assertions.

Supabase documents `onAuthStateChange` as the mechanism for initial, sign-in, sign-out and refresh events. [Supabase auth-state changes](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)

Account behavior:

- Browsing and cart creation do not require login.
- Wishlist requires Google sign-in.
- Checkout requires Google sign-in for the initial implementation.
- After login, merge the guest cart into the user’s active database cart.
- Preserve validated same-origin return paths.

# 6. Cart and wishlist architecture

## Cart: hybrid

Use:

- Guest cart in browser storage.
- Authenticated cart in PostgreSQL.
- Account required before checkout.

Guest cart contains only:

```text
product_id
quantity
updated_at
```

It does not contain trusted names, prices, totals or stock.

When authentication succeeds:

1. Load/create the user’s active cart.
2. Merge guest quantities by product ID.
3. Apply maximum quantity rules.
4. Clear the guest cart only after successful persistence.

A small cart provider/reducer can coordinate UI and guest persistence. TanStack Query owns the authenticated server cart. A new global-state library is unnecessary.

All cart totals displayed in the browser are estimates. Checkout reloads authoritative product prices and inventory.

## Wishlist

- Authentication required.
- One `wishlists` row per user/product.
- Composite primary key prevents duplicates.
- TanStack Query reads and mutates the signed-in user’s rows under RLS.
- No Edge Function is required.

# 7. Checkout and Razorpay architecture

Razorpay requires every payment to be associated with a server-created Razorpay order. Signature verification must occur server-side. [Razorpay Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/?preferred-country=IN)

## Browser responsibilities

1. Ensure the user is authenticated.
2. Collect/select a shipping address.
3. Invoke `create-checkout`.
4. Receive:
   - internal order ID
   - Razorpay order ID
   - public Razorpay key ID
   - authoritative amount/currency
5. Open Razorpay Standard Checkout.
6. Send returned payment ID, Razorpay order ID and checkout signature to `verify-payment`.
7. Display pending/success/failure based on server order status.
8. Never mark an order paid itself.

## `create-checkout` Edge Function

Authenticated invocation.

1. Verify the Supabase user.
2. Validate the request with Zod.
3. Call an atomic PostgreSQL checkout function.
4. PostgreSQL:
   - locks relevant inventory rows
   - reloads active products and current prices
   - validates quantities and stock
   - calculates totals
   - creates `pending_payment` order
   - snapshots order items and address
   - atomically decrements inventory
   - marks stock allocated
   - marks cart converted
5. Edge Function creates the Razorpay order using secret credentials.
6. Save the Razorpay order ID and payment record.
7. Return checkout-safe information.

If Razorpay creation fails, run an idempotent cancellation function that restores allocated stock.

## Why inventory is reduced before payment

Reducing inventory only after the webhook allows two customers to pay for the final item. Therefore checkout creation temporarily allocates stock by decrementing it transactionally.

No separate reservation table is needed because:

- `orders.status = pending_payment`
- `stock_allocated`
- `stock_released`
- `expires_at`

provide the minimum reservation state.

A scheduled PostgreSQL job expires abandoned pending orders and restores stock exactly once.

## Immediate payment verification

`verify-payment`:

- Receives Razorpay payment ID, order ID and signature.
- Loads the expected Razorpay order ID from the database.
- Computes the required HMAC using the Razorpay secret.
- Uses a timing-safe comparison.
- Confirms the amount/order with Razorpay where necessary.
- Calls the same idempotent payment-finalization database function used by the webhook.

Razorpay specifies that the signature must be derived from the server’s stored order ID—not an untrusted order ID—and verified server-side. [Razorpay signature verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/?preferred-country=IN)

## Webhook

`razorpay-webhook`:

- Does not require a Supabase user JWT.
- Reads the raw request body.
- Verifies `X-Razorpay-Signature` with the webhook secret.
- Records the unique webhook event/payment identifier.
- Ignores previously processed events.
- Handles events even if delivered repeatedly or out of order.
- Updates payment/order through the shared finalization function.
- Returns success quickly after durable processing.

Razorpay requires signature verification against the unparsed raw body. [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)

## Paid transition

An order becomes `paid` only when:

- Signature is valid.
- Razorpay order IDs match.
- Payment amount and currency match the internal order.
- The payment is in the accepted captured/paid state.
- The operation has not already been applied.

Inventory is not decremented again because it was allocated during checkout.

## Failed, cancelled and expired payments

- Restore stock through an idempotent PostgreSQL function.
- Set `stock_released = true`.
- Set order status to `payment_failed` or `cancelled`.
- Never restore stock twice.
- If a payment arrives after expiration/release, flag it for refund/reconciliation rather than fulfilling unavailable stock.

# 8. Inventory strategy

Keep one inventory row per product.

Safe stock removal:

```sql
UPDATE inventory
SET stock_quantity = stock_quantity - requested_quantity
WHERE product_id = ...
  AND stock_quantity >= requested_quantity;
```

The checkout database function locks/processes all required rows in a deterministic order and fails the entire transaction if any product lacks stock.

Stock operations:

- Customer checkout: transactional allocation.
- Failed/expired checkout: transactional restoration.
- Successful payment: allocation becomes final.
- Admin addition/removal: controlled admin function with positive/negative adjustment validation.
- Product pages: safe availability status, not authoritative checkout promises.

No inventory movements table is required initially. If the business later needs audit history, warehouse reconciliation or multiple staff adjusting stock, that becomes a concrete reason to add it.

# 9. Supabase Storage strategy

Create one public bucket:

```text
product-images/
  products/{product_id}/{generated-file-id}.{extension}
```

Product photos are public storefront assets, so a public bucket is appropriate. Public buckets allow direct cached delivery; upload, update and deletion still remain policy-controlled. [Supabase bucket access models](https://supabase.com/docs/guides/storage/buckets/fundamentals)

Rules:

- Anyone can retrieve public product images.
- Only admins can insert/update/delete objects.
- Restrict MIME types to approved image formats.
- Set a maximum upload size.
- Generate filenames; never trust original filenames as paths.
- Store the object path—not a temporary signed URL—in `product_images`.
- Derive public URLs through Supabase Storage.
- Store alt text and ordering in PostgreSQL.
- Deleting a product image removes both the storage object and metadata through an admin workflow.

Storage permissions are implemented using policies on `storage.objects`. The service-role key must never be exposed. [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)

Base44 media migration:

1. Download the three Base44-hosted originals.
2. Verify file integrity and usage.
3. Upload them into `product-images`.
4. Create/update corresponding image metadata.
5. Replace every `media.base44.com` URL.
6. Verify the built site makes no request to Base44.
7. Only then remove the old hosted assets/dependency.

Static brand assets such as the favicon and logo may remain in `public/`.

# 10. Exact Base44 removal plan

Remove:

- `@base44/sdk`
- `@base44/vite-plugin`
- Their lockfile entries and Base44-only transitive packages
- `src/api/base44Client.js`
- `src/lib/app-params.js`
- `base44/config.jsonc`
- `base44/entities/User.jsonc`
- Entire `base44/` directory
- Base44 Vite plugin configuration
- Base44 startup/public-settings requests
- Base44 authentication calls
- Base44 MCP consent page
- Base44-specific errors
- Base44 media transformations
- Base44 deployment instructions

Rewrite:

- `src/lib/AuthContext.jsx` → Supabase session provider
- Login page → Google OAuth
- Register page → Google OAuth/account onboarding
- Password pages → remove unless email/password authentication is later enabled
- `ProtectedRoute.jsx` → Supabase session/profile checks
- `PageNotFound.jsx` → use existing auth context or no auth lookup
- `authReturnTo.js` → retain generic open-redirect protection, remove Base44 parameter handling
- `vite.config.js` → React/Vite only
- `README.md` → Supabase local development, migrations, functions and deployment
- `AGENTS.md` → Supabase-centered standards
- Package name → project-specific name

Remove environment variables:

```text
VITE_BASE44_APP_ID
VITE_BASE44_FUNCTIONS_VERSION
VITE_BASE44_APP_BASE_URL
BASE44_LEGACY_SDK_IMPORTS
```

Remove URL/storage behavior:

```text
app_id
app_base_url
functions_version
access_token bootstrap
clear_access_token
from_url Base44 behavior
base44_* localStorage keys
```

Add a one-time cleanup for historical Base44 keys, then remove that cleanup after the migration window.

Replace Base44 media references in:

- `src/lib/images.js`
- `src/components/ui/image-helpers.js`
- Base44-specific comments in `src/components/ui/image.jsx`

Final verification:

```text
No source reference to:
- base44
- @base44
- media.base44.com
- VITE_BASE44
- /api/apps

No Base44 package in the lockfile
No browser request to a Base44 host
No Base44 storage key created
No Base44 CLI needed for install, development, build or deployment
```

# 11. Final frontend structure

Introduce new modules incrementally; do not move working presentational code merely for symmetry.

```text
src/
  app/
    App.jsx
    router.jsx
    providers.jsx
    ErrorBoundary.jsx

  api/
    supabaseClient.ts
    database.types.ts
    queryKeys.ts

  components/
    ui/                    Existing primitives
    layout/                Navbar, Footer, Layout
    sections/              Existing public sections

  features/
    auth/
      AuthProvider.jsx
      authService.ts
      ProtectedRoute.jsx
      AdminRoute.jsx

    products/
      productService.ts
      productQueries.ts
      productSchemas.ts
      components/

    cart/
      CartProvider.jsx
      cartDomain.ts
      cartStorage.ts
      cartService.ts
      cartQueries.ts
      components/

    wishlist/
      wishlistService.ts
      wishlistQueries.ts
      components/

    checkout/
      checkoutService.ts
      checkoutSchemas.ts
      razorpayCheckout.ts
      components/

    orders/
      orderService.ts
      orderQueries.ts
      components/

    addresses/
      addressService.ts
      addressSchemas.ts
      components/

    admin/
      productAdminService.ts
      inventoryAdminService.ts
      components/

  domain/
    money.ts
    orderStatus.ts
    cartRules.ts

  pages/                    Existing and new route-level pages
  lib/                      Generic shared utilities
```

Do not create generic repository/interface layers around every Supabase call. Feature services provide the necessary UI/data boundary.

New modules should be TypeScript. Existing JSX can migrate only when touched for a substantive reason.

# 12. Required Edge Functions

Only three are initially required:

## `create-checkout`

- Authenticated
- Validates cart/address
- Calls atomic checkout SQL function
- Creates Razorpay order
- Stores provider order details

## `verify-payment`

- Authenticated
- Provides immediate checkout confirmation
- Verifies Razorpay checkout signature
- Calls shared idempotent finalization function

## `razorpay-webhook`

- Public endpoint with cryptographic webhook verification
- Uses raw request body
- Handles asynchronous authoritative payment events
- Calls shared idempotent finalization/cancellation functions

No Edge Function is required for:

- Product listing
- Wishlist CRUD
- Normal cart CRUD
- Profile/address CRUD
- Public product images
- Standard admin CRUD protected by RLS

Required PostgreSQL functions:

- `create_pending_order`
- `cancel_pending_order`
- `finalize_paid_order`
- `expire_pending_orders`
- `adjust_inventory`
- optionally `merge_guest_cart`

Database-intensive atomic work belongs in PostgreSQL rather than Edge Functions.

# 13. Implementation order

1. **Baseline and safeguards**
   - Record current routes/design behavior.
   - Add testing foundation.
   - Define environment conventions.

2. **Supabase project foundation**
   - Add local Supabase configuration.
   - Add migrations.
   - Add generated database types.
   - Create the Supabase browser client.

3. **Profiles and authentication**
   - Configure Google OAuth.
   - Add profile trigger and RLS.
   - Replace Base44 AuthContext.
   - Connect auth routes and route guards.

4. **Base44 media removal**
   - Migrate three hosted assets.
   - Remove Base44 image helpers and URLs.

5. **Complete Base44 removal**
   - Remove packages, plugin, client, config, entities, bootstrap and documentation.
   - Regenerate the lockfile.
   - Run zero-reference/network verification.

6. **Dynamic product catalog**
   - Add products, images and inventory.
   - Seed current static products.
   - Add query services.
   - Preserve current UI and URLs.

7. **Admin catalog**
   - Product editing.
   - Image upload/order.
   - Inventory adjustment.
   - Admin RLS tests.

8. **Wishlist**
   - User-owned table and UI integration.

9. **Hybrid cart**
   - Guest cart.
   - Authenticated cart.
   - Sign-in merge.
   - Cart-domain tests.

10. **Addresses and account**
    - Profile/account pages.
    - Address CRUD.
    - Responsive form validation.

11. **Orders and inventory allocation**
    - Transactional checkout SQL.
    - Order snapshots.
    - Expiration and stock restoration.

12. **Razorpay**
    - Create-checkout function.
    - Checkout UI.
    - Immediate verification.
    - Signed webhook.
    - Idempotency and reconciliation tests.

13. **Fulfillment/admin orders**
    - Valid status transitions.
    - Shipping/tracking management.
    - Customer order history.

14. **Production hardening**
    - RLS tests for anonymous/customer/admin roles.
    - Payment replay/out-of-order tests.
    - Accessibility and responsive QA.
    - Error monitoring.
    - Database backups.
    - Rate limits and secret review.
    - Staging/test-mode checkout before production.

This architecture requires no additional backend framework and keeps Supabase, PostgreSQL and Razorpay within one practical modular monolith. No files were modified.