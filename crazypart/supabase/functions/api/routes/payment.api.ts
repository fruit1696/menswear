import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { jsonResponse } from "../../http/response.ts";
import { PaymentService } from "../../services/payment.service.ts";
import { AppError } from "../../errors/app-error.ts";

/**
 * PAYMENT VERIFICATION API ROUTE HANDLER (`POST /api/payment/verify`)
 *
 * Execution Workflow & Security Steps:
 *
 * 1. HTTP Method Check: Ensures request is POST.
 * 2. Parameter Validation: Checks presence of `orderId`, `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`.
 * 3. Business Service Delegation (`PaymentService.verifyPayment`):
 *    a. HMAC Signature Verification: Computes HMAC-SHA256 of `${razorpayOrderId}|${razorpayPaymentId}` with `RAZORPAY_KEY_SECRET`
 *       and compares it with client-provided signature to prevent payment spoofing.
 *    b. Order Ownership Verification: Verifies that `order.user_id === userId`.
 *    c. Idempotency Check: Returns early if order status is already `'paid'`.
 *    d. Payment Transition: Updates `public.payments` status to `'completed'`.
 *    e. Order Fulfillment Transition: Updates `public.orders` status to `'paid'`.
 *    f. Permanent Stock Decrement: Decrements `public.products.stock_quantity` for all ordered line items.
 * 4. Response: Returns `{ success: true, orderId }` with HTTP 200 OK.
 */
export async function handleVerifyPayment(
    request: Request,
    userId: string,
    dbClient: SupabaseClient,
): Promise<Response> {
    // Step 1: Enforce HTTP POST
    if (request.method !== "POST") {
        throw new AppError({ message: "Method not allowed", status: 405, code: "METHOD_NOT_ALLOWED", expose: true });
    }

    // Step 2: Parse and validate payment parameters
    const body = await request.json().catch(() => ({}));
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new AppError({
            message: "Missing payment verification parameters: orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature required",
            status: 400,
            code: "INVALID_PAYLOAD",
            expose: true,
        });
    }


    // Step 3: Invoke Payment Service for cryptographic verification and state update
    const paymentService = new PaymentService(dbClient);
    const result = await paymentService.verifyPayment({
        userId,
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    });

    // Step 4: Return success response
    return jsonResponse(request, result, 200);
}

/**
 * RAZORPAY WEBHOOK API ROUTE HANDLER (`POST /api/payment/webhook`)
 *
 * Execution Workflow & Security Steps:
 *
 * 1. HTTP Method Check: Ensures request is POST.
 * 2. Header Validation: Checks for `x-razorpay-signature` header.
 * 3. Raw Body Signature Verification: Verifies webhook signature against `RAZORPAY_WEBHOOK_SECRET`.
 * 4. Asynchronous Event Processing:
 *    - `payment.captured`: Updates payment status to `'completed'` and order status to `'paid'`.
 *    - `payment.failed`: Updates payment status to `'failed'` with error description.
 * 5. Response: Returns `{ received: true }` to Razorpay server.
 */
export async function handlePaymentWebhook(
    request: Request,
    dbClient: SupabaseClient,
): Promise<Response> {
    // Step 1: Enforce HTTP POST
    if (request.method !== "POST") {
        throw new AppError({ message: "Method not allowed", status: 405, code: "METHOD_NOT_ALLOWED", expose: true });
    }

    // Step 2: Extract signature header
    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
        throw new AppError({ message: "Missing Razorpay signature header", status: 400, code: "MISSING_SIGNATURE", expose: true });
    }


    // Step 3: Parse raw body and process event idempotently
    const rawBody = await request.text();
    const paymentService = new PaymentService(dbClient);
    const result = await paymentService.handleWebhook(rawBody, signature);

    // Step 4: Return HTTP 200 acknowledgement to Razorpay
    return jsonResponse(request, result, 200);
}

