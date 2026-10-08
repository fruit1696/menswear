# Edge Functions

Backend design and access rules are defined in [`../../LLD.md`](../../LLD.md).

- `api/index.ts` is the single application API entry point and composition root.
- Endpoint handlers live in `api/routes` and remain thin.
- Business workflows live in `services`.
- PostgreSQL access lives in `dao`.
- Third-party calls live in `integrations`.
- Cross-cutting HTTP, auth, validation, configuration, logging, errors, and database setup live in their named top-level folders.

Only the new layered scaffold is retained. Add each backend capability as a tested vertical slice through API, service, and DAO/integration layers.


Testing Payments:

Here is how **Razorpay is integrated** in our architecture, what **Razorpay setup** is required, and **how to test it step-by-step**:

---

### 1. How Razorpay is Integrated

```
┌─────────────────┐       1. POST /api/checkout       ┌────────────────────────┐       2. Create Order       ┌──────────────────┐
│  React Frontend │ ─────────────────────────────────► │ Supabase Edge Function │ ──────────────────────────► │ Razorpay Server  │
└────────┬────────┘                                    └────────────────────────┘                            └────────┬─────────┘
         │                                                        ▲                                                   │
         │ 3. Returns razorpay_order_id                           │                                                   │ 4. Order ID
         └────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┘
         │                                                        │
         ▼                                                        │
 5. Open Razorpay Checkout Modal (SDK)                            │
    (Customer enters test card & pays)                            │
         │                                                        │
         ▼                                                        │
 6. Returns (order_id, payment_id, signature)                    │
         │                                                        │
         └─────── 7. POST /api/payment/verify ────────────────────┘
                  (Backend verifies HMAC signature with KEY_SECRET,
                   marks order as 'paid', & decrements stock)
```

---

### 2. What Razorpay Setup You Need

#### Step A: Get Test API Keys from Razorpay
1. Sign up/log in at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Switch the dashboard toggle at the top right to **Test Mode**.
3. Go to **Account & Settings** $\rightarrow$ **API Keys** $\rightarrow$ Click **Generate Test Key**.
4. Save the generated keys:
   * **Key ID**: (Starts with `rzp_test_...`)
   * **Key Secret**: (Keep secret, backend only)

#### Step B: Set Environment Variables

##### 1. Backend Supabase Edge Function Secrets (`.env` or Supabase Secrets)
```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_test_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

##### 2. Dynamic `keyId` Return (Zero Frontend Env Vars)
The `/api/checkout` endpoint returns the public `keyId` dynamically in the session response:
```json
{
  "orderId": "order_999",
  "orderNumber": "ORD-12345678-100",
  "razorpayOrderId": "rzp_order_555",
  "keyId": "rzp_test_XXXXXXXXXXXXXX",
  "amountPaise": 62400,
  "currency": "INR"
}
```
The frontend passes `result.keyId` directly to `new window.Razorpay({ key: result.keyId, ... })`, eliminating the need to hardcode `VITE_RAZORPAY_KEY_ID` in frontend `.env.local` files!


---

### 3. How to Test End-to-End

#### Step 1: Initiate Checkout
From the frontend app, add items to cart and click **"Proceed to Checkout"**.
* The frontend sends items and shipping address to `POST /api/checkout`.
* Backend fetches authoritative prices from PostgreSQL, creates a pending order, and calls Razorpay API to generate `razorpay_order_id`.

#### Step 2: Pay via Razorpay Test Modal
When the Razorpay pop-up modal opens:
* **Card Number**: Use dummy test card `4111 1111 1111 1111` (or any valid luhn card).
* **Expiry Date**: Any future date (e.g., `12/30`).
* **CVV**: `123`.
* **OTP Simulator**: Click **"Success"** (or enter `123456`).

#### Step 3: Verification & Order Confirmation
* On modal success callback, the frontend posts `{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }` to `/api/payment/verify`.
* The backend verifies the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`, updates the order status to `'paid'`, and decrements available stock.