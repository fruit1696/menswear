import { describe, expect, it } from "vitest";
import { RazorpayGateway } from "./razorpay.client.ts";

describe("RazorpayGateway integration client", () => {
    const gateway = new RazorpayGateway("test_key_id", "test_key_secret");

    it("verifies HMAC-SHA256 signatures correctly", async () => {
        const orderId = "order_123456";
        const paymentId = "pay_789012";
        const payload = `${orderId}|${paymentId}`;

        // Generate expected signature using same HMAC secret 'test_key_secret'
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode("test_key_secret"),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"],
        );
        const signatureBuffer = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(payload),
        );
        const validSignature = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const isValid = await gateway.verifyCheckoutSignature(orderId, paymentId, validSignature);
        expect(isValid).toBe(true);

        const isInvalid = await gateway.verifyCheckoutSignature(orderId, paymentId, "invalid_signature");
        expect(isInvalid).toBe(false);
    });
});
