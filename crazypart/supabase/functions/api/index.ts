import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createAdminClient } from "../database/client.ts";
import { authenticateRequest } from "../auth/authenticate.ts";
import { errorResponse, jsonResponse, noContentResponse } from "../http/response.ts";
import { corsHeaders } from "../http/cors.ts";
import { AppError } from "../errors/app-error.ts";
import { handleCheckoutSession } from "./routes/checkout.api.ts";
import { handlePaymentWebhook, handleVerifyPayment } from "./routes/payment.api.ts";
import { handleGetOrderById, handleGetOrders } from "./routes/order.api.ts";

serve(async (request: Request) => {
    const requestId = crypto.randomUUID();

    // CORS preflight handling
    if (request.method === "OPTIONS") {
        return noContentResponse(request);
    }

    try {
        const url = new URL(request.url);
        const path = url.pathname.replace(/\/$/, "");
        const adminDb = createAdminClient();

        // Public webhook endpoint
        if (path.endsWith("/payment/webhook") || path.endsWith("/payments/webhook")) {
            return await handlePaymentWebhook(request, adminDb);
        }

        // Protected endpoints require valid authentication
        const user = await authenticateRequest(request);

        if (path.endsWith("/checkout") || path.endsWith("/checkout/session")) {
            return await handleCheckoutSession(request, user.id, adminDb);
        }

        if (path.endsWith("/payment/verify") || path.endsWith("/payments/verify")) {
            return await handleVerifyPayment(request, user.id, adminDb);
        }

        if (path.endsWith("/orders")) {
            return await handleGetOrders(request, user.id, adminDb);
        }

        const orderIdMatch = path.match(/\/orders\/([a-f0-9-]+)$/i);
        if (orderIdMatch) {
            return await handleGetOrderById(request, user.id, orderIdMatch[1], adminDb);
        }

        throw new AppError("Route not found", 404, "NOT_FOUND", true);
    } catch (err: unknown) {
        if (err instanceof AppError) {
            return errorResponse(request, err, requestId);
        }
        const appErr = new AppError("Internal server error", 500, "INTERNAL_ERROR", false);
        return errorResponse(request, appErr, requestId);
    }
});
