import type {
    CapturedPayment,
    CreatePaymentOrderInput,
    PaymentGateway,
    PaymentOrder,
} from "./razorpay.types.ts";
import { getRequiredEnv } from "../../config/env.ts";
import { AppError } from "../../errors/app-error.ts";

export class RazorpayGateway implements PaymentGateway {
    private keyId: string;
    private keySecret: string;

    constructor(keyId?: string, keySecret?: string) {
        this.keyId = keyId ?? getRequiredEnv("RAZORPAY_KEY_ID");
        this.keySecret = keySecret ?? getRequiredEnv("RAZORPAY_KEY_SECRET");
    }

    private getAuthHeader(): string {
        const credentials = `${this.keyId}:${this.keySecret}`;
        const encoded = btoa(credentials);
        return `Basic ${encoded}`;
    }

    async createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder> {
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                Authorization: this.getAuthHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: input.amountPaise,
                currency: input.currency || "INR",
                receipt: input.receipt,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new AppError({
                message: `Razorpay order creation failed: ${errorText}`,
                status: 502,
                code: "PAYMENT_GATEWAY_ERROR",
                expose: true,
            });
        }


        const data = await response.json();
        return {
            id: data.id,
            amountPaise: data.amount,
            currency: data.currency,
        };
    }

    async verifyCheckoutSignature(
        orderId: string,
        paymentId: string,
        signature: string,
    ): Promise<boolean> {
        const payload = `${orderId}|${paymentId}`;
        const expectedSignature = await this.generateHmacSha256(payload, this.keySecret);
        return expectedSignature === signature;
    }

    async capturePayment(
        paymentId: string,
        amountPaise: number,
        currency: string,
    ): Promise<CapturedPayment> {
        const response = await fetch(
            `https://api.razorpay.com/v1/payments/${paymentId}/capture`,
            {
                method: "POST",
                headers: {
                    Authorization: this.getAuthHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: amountPaise,
                    currency: currency || "INR",
                }),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new AppError({
                message: `Razorpay payment capture failed: ${errorText}`,
                status: 502,
                code: "PAYMENT_GATEWAY_ERROR",
                expose: true,
            });
        }


        const data = await response.json();
        return {
            id: data.id,
            orderId: data.order_id,
            amountPaise: data.amount,
            currency: data.currency,
            status: "captured",
        };
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
