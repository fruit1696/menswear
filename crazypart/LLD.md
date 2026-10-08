# Crazy Cut Piece — Backend Low-Level Design

## 1. Purpose and status

This document defines the target backend design for Crazy Cut Piece. Read it with `ARCHITECTURE.md` and `AGENTS.md` before changing backend, database, authentication, checkout, or payment code.

This is an architectural decision and implementation guide. Do not assume a rule is implemented until its code, migration, and tests exist.

## 2. Architecture decision

Use custom Supabase Edge Function APIs for all business data and workflows. Continue using Supabase Auth directly from the frontend for authentication and session management.

```text
Browser
  |-- Supabase Auth: signup, login, OAuth, logout, session refresh
  |
  `-- Custom API: all application and business data
         |
         v
      API handler
         |
         v
      Service
       /    \
      v      v
 Repository  Integration
      |          |
 PostgreSQL   Razorpay/other providers
```

The frontend must use custom APIs for profiles, carts, wishlists, addresses, catalog data, inventory, pricing, reviews, checkout, orders, and payments. It must not query or mutate those tables directly through the Supabase Data API.

RLS remains enabled on every exposed table as defense in depth. Moving access behind custom APIs is not a reason to weaken database policies.

## 3. Layer responsibilities

### 3.1 API layer

An Edge Function handler is the HTTP boundary. It is responsible for:

- routing and allowed HTTP methods;
- parsing and validating path, query, and body data;
- validating the caller's Supabase access token;
- coarse authorization, such as customer versus administrator access;
- rate limiting and request-size limits where appropriate;
- attaching request IDs and safe logging context;
- invoking one application service or use case;
- mapping typed application errors to consistent HTTP responses;
- setting CORS, security headers, and response content type.

Handlers must not contain SQL, pricing logic, stock calculations, order transitions, or Razorpay workflows.

Authentication answers **who the caller is**. Authorization answers **whether the caller may perform the action**. Check both where required.

### 3.2 Service layer

Services own business rules and application workflows. They are responsible for:

- coordinating DAOs and third-party integrations;
- enforcing pricing, inventory, cart, checkout, order, refund, and review rules;
- deriving authoritative totals from server-side product data;
- defining transaction boundaries;
- applying idempotency rules to checkout, payment, and webhook workflows;
- returning results independent of HTTP details.

Services must not read HTTP requests, construct HTTP responses, execute inline SQL, or depend on frontend types.

### 3.3 DAO layer

DAOs are the only application modules that access PostgreSQL. They are responsible for:

- focused queries and persistence operations;
- mapping database records to DAO/domain types;
- accepting an explicit database client or transaction context;
- returning predictable results and database errors to services.

DAOs must not contain HTTP handling, payment-provider calls, or cross-feature business workflows. Prefer focused DAOs over a generic `BaseDao` or unrestricted CRUD abstraction.

### 3.4 Integration layer

Integrations wrap third-party systems such as Razorpay, WhatsApp, email, and storage. They are responsible for:

- provider-specific requests, signatures, payloads, and response mapping;
- timeouts and safe retry behavior;
- converting provider failures into typed integration errors;
- preventing provider details from leaking into services and handlers.

A Razorpay client is an integration, not a DAO. Services depend on its narrow contract rather than scattering Razorpay calls throughout the codebase.

### 3.5 Shared infrastructure

Shared modules may provide authentication helpers, validation primitives, HTTP responses, typed errors, logging, database-client construction, configuration, and idempotency utilities.

Shared code must remain focused. Do not create generic helpers that obscure feature ownership or weaken type safety.

## 4. Required dependency direction

```text
API route -> service -> DAO
                     -> integration
```

Dependencies flow only in this direction. DAOs and integrations never import API routes. Services do not depend on concrete HTTP objects. Circular dependencies are not allowed.

Use dependency injection through small typed interfaces when it improves testing or isolates infrastructure. Avoid unnecessary inheritance, generic `BaseService` classes, and abstractions that merely rename Supabase methods.

## 5. Suggested backend organization

Use a single API Edge Function and organize its implementation by layer. Each business area gets a focused file within the appropriate layer:

```text
supabase/functions/
  api/
    index.ts
    routes/
      profile.api.ts
      cart.api.ts
      wishlist.api.ts
      address.api.ts
      product.api.ts
      review.api.ts
      order.api.ts
      checkout.api.ts
      payment.api.ts
  auth/
  config/
  database/
  errors/
  http/
  logging/
  validation/
  services/
    profile.service.ts
    cart.service.ts
    wishlist.service.ts
    address.service.ts
    product.service.ts
    review.service.ts
    order.service.ts
    checkout.service.ts
    payment.service.ts
  dao/
    profile.dao.ts
    cart.dao.ts
    wishlist.dao.ts
    address.dao.ts
    product.dao.ts
    review.dao.ts
    order.dao.ts
    payment.dao.ts
  integrations/
    razorpay/
    messaging/
  payment-webhook/
    index.ts
```

`api/index.ts` is the composition root and request dispatcher. Route files stay thin and delegate to `services`; services use `dao` and `integrations`. Keep the payment webhook as a separate Edge Function because it has different authentication, raw-body verification, and exposure requirements.

## 6. Frontend access boundary

### Direct Supabase access allowed

The browser may use Supabase Auth directly for:

- email/password signup and login;
- Google or other OAuth login;
- logout;
- password reset/recovery;
- session retrieval and refresh.

The browser sends the access token to custom APIs. Each protected API validates it and derives the authenticated Supabase user ID from it. Never trust a browser-supplied user ID as proof of identity.

### Custom API required

All application data goes through custom APIs, including:

- profile details;
- cart and wishlist;
- addresses;
- products, authoritative prices, and stock;
- reviews;
- checkout and order creation;
- orders and order items;
- payments and refunds.

Frontend server state should use focused feature API clients and TanStack Query. Local React state remains appropriate for temporary UI state.

## 7. Authorization and operation rules

Do not expose generic CRUD merely because a table supports it. Each endpoint represents an allowed business capability.

| Resource | Customer permissions | Trusted backend/admin permissions |
|---|---|---|
| Profile | Read own; update allowed fields only | Explicit support operations if required |
| Cart | Read and modify own cart | Reconcile authoritative price and availability |
| Wishlist | Read and modify own wishlist | None by default |
| Addresses | Read and modify own addresses | Read when required to fulfil an order |
| Products | Read published products | Create/update/archive through admin capability |
| Inventory and pricing | Read public availability/prices | Mutate through controlled admin/order workflows |
| Reviews | Read; create/update/delete own review according to policy | Moderate through explicit admin capability |
| Orders | **Read own orders only** | Create during checkout; controlled status transitions |
| Order items | **Read items belonging to own orders only** | Create during checkout; no arbitrary customer mutation |
| Payments | Read safe status for own orders | Create/verify/update through payment workflows and webhooks |

### Order rule

“Customer orders are read-only” means customers receive only GET/list/detail capabilities after creation. Customers never directly insert, update, or delete order records.

Order creation is a checkout use case, not customer CRUD. The checkout service validates the cart, reloads authoritative prices, checks stock, calculates totals, snapshots order items, and creates the pending order transactionally. Payment verification/webhooks and explicit admin workflows are the only mechanisms allowed to change payment or order status.

Cancellation, return, and refund requests must be explicit business commands with their own rules—not generic order updates.

## 8. Profile and authentication decisions

Supabase Auth owns authentication and identity management, including:

- Google/Gmail login;
- email/password login, if enabled;
- sessions;
- password reset;
- authentication identities and providers.

`auth.users` remains owned and managed by Supabase Auth. The application must not duplicate or replace it with a custom authentication model.

A separate custom `profiles` table represents the application-level customer/profile entity. Its identity relationship is conceptually:

```text
auth.users.id -> profiles.user_id
```

The profile schema is intentionally undecided. Do not add or assume customer-information columns until those requirements are agreed.

Where appropriate, business tables such as `orders` and `reviews` should reference the application-level profile/customer entity rather than depending directly on `auth.users`.

Google/email login behavior, including handling the same email across authentication providers, will be designed separately before implementation. Do not introduce custom authentication functions, profile-creation triggers, or account-linking logic as part of this decision.

## 9. Checkout and payment rules

- PostgreSQL is authoritative for prices, discounts, stock, order totals, and payment state.
- Never accept totals, discounts, payment success, or stock assertions from the frontend.
- Never expose the Supabase service-role key or Razorpay secrets to the browser.
- Preserve the selected product and quantity across login/signup through a safe client-side intent or server-side checkout session; revalidate all values after authentication.
- Payment creation and verification occur through custom backend APIs.
- Verify Razorpay webhook signatures using the raw request body and provider secret.
- Webhook processing must be idempotent and safe for duplicate or out-of-order delivery.
- A client redirect or callback alone never marks an order as paid.
- Show order confirmation only from authoritative backend payment/order state.

## 10. Transactions, concurrency, and idempotency

Use a PostgreSQL transaction or atomic database function when a workflow must update multiple records consistently. Checkout must not leave partial orders, incorrect totals, or inconsistent inventory.

Define concurrency behavior for stock reservation and deduction before production rollout. Payment and order workflows require stable idempotency keys or unique provider identifiers so retries cannot create duplicate orders, charges, or state transitions.

## 11. Validation and error contract

Validate all external input at the API boundary with feature-specific schemas. Services still enforce business invariants because input validation cannot establish current price, ownership, stock, or payment state.

Use a consistent, non-sensitive error shape:

```json
{
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "The selected product is no longer available.",
    "requestId": "..."
  }
}
```

Do not return stack traces, SQL details, secrets, or raw provider errors. Log diagnostic context server-side with secrets and sensitive personal/payment data redacted.

## 12. Security requirements

- Validate the Supabase JWT for every protected request.
- Derive ownership from the validated identity.
- Apply least-privilege authorization at endpoint, service, and database levels.
- Keep RLS enabled and test allowed and denied paths.
- Keep service-role and provider secrets only in server-side environment configuration.
- Validate webhook signatures before processing payloads.
- Restrict CORS to approved production origins.
- Rate-limit authentication-adjacent, checkout, payment, review, and other abuse-sensitive endpoints.
- Never log authorization headers, passwords, tokens, secrets, or full payment data.

## 13. Testing requirements

Each feature should include tests appropriate to its risk:

- handler tests for method handling, schema validation, authentication, authorization, and error mapping;
- service unit tests for business rules and failure paths using DAO/integration fakes;
- DAO integration tests against PostgreSQL/Supabase;
- RLS and grant tests proving cross-user and anonymous access is denied;
- payment signature, idempotency, retry, and duplicate-webhook tests;
- end-to-end tests for login, checkout, payment confirmation, and order history.

Run relevant lint, type-check, tests, and production build before completing implementation changes.

## 14. Implementation sequence

Migrate incrementally instead of rewriting every feature at once:

1. Establish shared HTTP, authentication, validation, error, logging, and database primitives.
2. Implement one representative vertical slice, preferably profiles, through API route, service, and DAO.
3. Migrate cart, wishlist, and addresses.
4. Migrate catalog, pricing, inventory, and reviews.
5. Implement checkout and read-only customer order APIs.
6. Implement Razorpay payment creation, verification, webhooks, and confirmation.
7. Remove obsolete frontend Data API calls only after each replacement is tested.
8. Audit grants, RLS, secrets, logs, and frontend imports before release.

During migration, document temporary exceptions explicitly. Do not maintain two writable paths to the same business data longer than necessary.

## 15. Definition of done

A backend feature is complete only when:

- its handler is thin and validates input, identity, and access;
- business rules reside in a service;
- database and provider operations are isolated behind DAOs/integrations;
- migrations and RLS policies are versioned under `supabase/migrations`;
- the frontend uses the custom API rather than direct table access;
- errors and logs follow the shared contract without leaking sensitive data;
- relevant allow and deny cases are tested;
- lint, type-check, tests, and build pass;
- this document or `ARCHITECTURE.md` is updated if the architectural decision changes.
