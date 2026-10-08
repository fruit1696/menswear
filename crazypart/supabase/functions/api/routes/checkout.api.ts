import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { jsonResponse } from "../../http/response.ts";
import { CheckoutService } from "../../services/checkout.service.ts";
import { AppError } from "../../errors/app-error.ts";

/**
 * CHECKOUT API ROUTE HANDLER (`POST /api/checkout`)
 *
 * Execution Workflow & Business Steps:
 *
 * 1. HTTP Method Check: Ensures only `POST` requests are processed.
 * 2. Payload Validation: Validates presence of `items` array and `shippingAddress`.
 * 3. Business Service Delegation (`CheckoutService.createCheckoutSession`):
 *    a. Authoritative Price Lookup: Queries `public.products.price_paise` directly from PostgreSQL.
 *    b. Inventory Validation & Reservation: Verifies stock and inserts 15-min hold rows into `public.inventory_reservations`.
 *    c. Server-Side Calculations: Calculates subtotal, shipping (Free over ₹999, else ₹99), and GST tax (5%).
 *    d. Draft Order Creation: Inserts pending order into `public.orders` and line items into `public.order_items`.
 *    e. Razorpay Integration: Secretly calls Razorpay API (`https://api.razorpay.com/v1/orders`) to generate a `razorpay_order_id`.
 *    f. Payment Record Creation: Inserts initial pending payment row into `public.payments`.
 * 4. Response: Returns `{ orderId, orderNumber, razorpayOrderId, amountPaise, currency }` with HTTP 201 Created.
 */
export async function handleCheckoutSession(
    request: Request,
    userId: string,
    dbClient: SupabaseClient,
): Promise<Response> {
    // Step 1: Enforce HTTP POST
    if (request.method !== "POST") {
        throw new AppError({ message: "Method not allowed", status: 405, code: "METHOD_NOT_ALLOWED", expose: true });
    }

    // Step 2: Parse and validate request payload
    const body = await request.json().catch(() => ({}));
    const { items, shippingAddress, billingAddress } = body;

    if (!items || !Array.isArray(items) || !shippingAddress) {
        throw new AppError({ message: "Invalid checkout payload: items array and shippingAddress required", status: 400, code: "INVALID_PAYLOAD", expose: true });
    }


    // Step 3: Invoke Checkout Service for authoritative processing
    const checkoutService = new CheckoutService(dbClient);
    const result = await checkoutService.createCheckoutSession({
        userId,
        items,
        shippingAddress,
        billingAddress,
    });

    // Step 4: Return JSON response to client
    return jsonResponse(request, result, 201);
}



