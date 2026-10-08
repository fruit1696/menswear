import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { AppError } from "../errors/app-error.ts";
import { RazorpayGateway } from "../integrations/razorpay/razorpay.client.ts";
import type { PaymentGateway } from "../integrations/razorpay/razorpay.types.ts";
import { getOrderById, updateOrderStatus } from "../dao/order.dao.ts";
import { getPaymentByProviderOrderId, updatePaymentStatus } from "../dao/payment.dao.ts";
import { decrementProductStock } from "../dao/product.dao.ts";
import { getRequiredEnv } from "../config/env.ts";

export type VerifyPaymentInput = {
    userId: string;
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
};

export class PaymentService {
    constructor(
        private dbClient: SupabaseClient,
        private paymentGateway: PaymentGateway = new RazorpayGateway(),
    ) {}

    async verifyPayment(input: VerifyPaymentInput): Promise<{ success: boolean; orderId: string }> {
        // 1. Verify HMAC signature
        const isValid = await this.paymentGateway.verifyCheckoutSignature(
            input.razorpayOrderId,
            input.razorpayPaymentId,
            input.razorpaySignature,
        );

        if (!isValid) {
            throw new AppError({ message: "Invalid payment signature", status: 400, code: "INVALID_SIGNATURE", expose: true });
        }

        // 2. Fetch order to verify ownership
        const order = await getOrderById(this.dbClient, input.orderId);
        if (!order) {
            throw new AppError({ message: "Order not found", status: 404, code: "ORDER_NOT_FOUND", expose: true });
        }
        if (order.user_id !== input.userId) {
            throw new AppError({ message: "Forbidden order access", status: 403, code: "FORBIDDEN", expose: true });
        }


        // Idempotency check: if already paid, return early
        if (order.status === "paid" || order.status === "processing") {
            return { success: true, orderId: order.id };
        }

        // 3. Fetch & Update Payment record
        const payment = await getPaymentByProviderOrderId(this.dbClient, input.razorpayOrderId);
        if (payment) {
            await updatePaymentStatus(this.dbClient, payment.id, "completed", input.razorpayPaymentId);
        }

        // 4. Update Order status to 'paid'
        await updateOrderStatus(this.dbClient, order.id, "paid");

        // 5. Permanently decrement inventory stock for order items
        for (const item of order.items) {
            await decrementProductStock(this.dbClient, item.product_id, item.quantity);
        }

        return { success: true, orderId: order.id };
    }

    async handleWebhook(rawBody: string, signatureHeader: string): Promise<{ received: boolean }> {
        const webhookSecret = getRequiredEnv("RAZORPAY_WEBHOOK_SECRET");
        const expectedSignature = await this.generateHmacSha256(rawBody, webhookSecret);

        if (expectedSignature !== signatureHeader) {
            throw new AppError("Invalid webhook signature", 400, "INVALID_WEBHOOK_SIGNATURE", true);
        }

        const payload = JSON.parse(rawBody);
        const event = payload.event;

        if (event === "payment.captured") {
            const paymentEntity = payload.payload?.payment?.entity;
            if (paymentEntity?.order_id) {
                const payment = await getPaymentByProviderOrderId(this.dbClient, paymentEntity.order_id);
                if (payment && payment.status !== "completed") {
                    await updatePaymentStatus(this.dbClient, payment.id, "completed", paymentEntity.id);
                    await updateOrderStatus(this.dbClient, payment.order_id, "paid");
                }
            }
        } else if (event === "payment.failed") {
            const paymentEntity = payload.payload?.payment?.entity;
            if (paymentEntity?.order_id) {
                const payment = await getPaymentByProviderOrderId(this.dbClient, paymentEntity.order_id);
                if (payment && payment.status !== "completed") {
                    await updatePaymentStatus(
                        this.dbClient,
                        payment.id,
                        "failed",
                        paymentEntity.id,
                        paymentEntity.error_description || "Payment failed",
                    );
                }
            }
        }

        return { received: true };
    }

    private async generateHmacSha256(text: string, secret: string): Promise<string> {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"],
        );
        const signatureBuffer = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(text),
        );
        return Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }
}
