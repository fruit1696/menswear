import { describe, expect, it, vi } from "vitest";
import { PaymentService } from "./payment.service.ts";
import { AppError } from "../errors/app-error.ts";

function createMockPaymentDb(orderRecord: any, paymentRecord: any) {
    return {
        from: (table: string) => {
            if (table === "orders") {
                return {
                    select: () => ({
                        eq: (_col: string, val: string) => ({
                            maybeSingle: () => ({ data: orderRecord && orderRecord.id === val ? orderRecord : null, error: null }),
                        }),
                    }),
                    update: () => ({
                        eq: () => ({ error: null }),
                    }),
                };
            }
            if (table === "order_items") {
                return {
                    select: () => ({
                        eq: () => ({ data: orderRecord?.items ?? [], error: null }),
                    }),
                };
            }
            if (table === "payments") {
                return {
                    select: () => ({
                        eq: () => ({
                            maybeSingle: () => ({ data: paymentRecord, error: null }),
                        }),
                    }),
                    update: () => ({
                        eq: () => ({ error: null }),
                    }),
                };
            }
            if (table === "products") {
                return {
                    select: () => ({
                        eq: () => ({
                            single: () => ({ data: { stock_quantity: 10 }, error: null }),
                        }),
                    }),
                    update: () => ({
                        eq: () => ({ error: null }),
                    }),
                };
            }
            return {};
        },
    } as any;
}

describe("PaymentService", () => {
    it("throws INVALID_SIGNATURE error if HMAC signature verification fails", async () => {
        const mockGateway = {
            createOrder: vi.fn(),
            verifyCheckoutSignature: vi.fn().mockResolvedValue(false),
            capturePayment: vi.fn(),
        };
        const service = new PaymentService(createMockPaymentDb(null, null), mockGateway);

        await expect(
            service.verifyPayment({
                userId: "usr_1",
                orderId: "ord_100",
                razorpayOrderId: "rzp_ord_1",
                razorpayPaymentId: "rzp_pay_1",
                razorpaySignature: "invalid_sig",
            }),
        ).rejects.toThrowError("Invalid payment signature");
    });

    it("throws ORDER_NOT_FOUND if order does not exist", async () => {
        const mockGateway = {
            createOrder: vi.fn(),
            verifyCheckoutSignature: vi.fn().mockResolvedValue(true),
            capturePayment: vi.fn(),
        };
        const service = new PaymentService(createMockPaymentDb(null, null), mockGateway);

        await expect(
            service.verifyPayment({
                userId: "usr_1",
                orderId: "ord_missing",
                razorpayOrderId: "rzp_ord_1",
                razorpayPaymentId: "rzp_pay_1",
                razorpaySignature: "valid_sig",
            }),
        ).rejects.toThrowError("Order not found");
    });

    it("throws FORBIDDEN error if user_id does not match order user_id", async () => {
        const mockGateway = {
            createOrder: vi.fn(),
            verifyCheckoutSignature: vi.fn().mockResolvedValue(true),
            capturePayment: vi.fn(),
        };
        const order = { id: "ord_100", user_id: "different_user", status: "pending_payment", items: [] };
        const service = new PaymentService(createMockPaymentDb(order, null), mockGateway);

        await expect(
            service.verifyPayment({
                userId: "usr_1",
                orderId: "ord_100",
                razorpayOrderId: "rzp_ord_1",
                razorpayPaymentId: "rzp_pay_1",
                razorpaySignature: "valid_sig",
            }),
        ).rejects.toThrowError("Forbidden order access");
    });

    it("verifies payment successfully and updates order to paid", async () => {
        const mockGateway = {
            createOrder: vi.fn(),
            verifyCheckoutSignature: vi.fn().mockResolvedValue(true),
            capturePayment: vi.fn(),
        };
        const order = {
            id: "ord_100",
            user_id: "usr_1",
            status: "pending_payment",
            items: [{ product_id: "p_1", quantity: 2 }],
        };
        const payment = { id: "pay_1", status: "pending" };
        const service = new PaymentService(createMockPaymentDb(order, payment), mockGateway);

        const result = await service.verifyPayment({
            userId: "usr_1",
            orderId: "ord_100",
            razorpayOrderId: "rzp_ord_1",
            razorpayPaymentId: "rzp_pay_1",
            razorpaySignature: "valid_sig",
        });

        expect(result).toEqual({ success: true, orderId: "ord_100" });
    });

    it("handles idempotency cleanly when order is already paid", async () => {
        const mockGateway = {
            createOrder: vi.fn(),
            verifyCheckoutSignature: vi.fn().mockResolvedValue(true),
            capturePayment: vi.fn(),
        };
        const order = { id: "ord_100", user_id: "usr_1", status: "paid", items: [] };
        const service = new PaymentService(createMockPaymentDb(order, null), mockGateway);

        const result = await service.verifyPayment({
            userId: "usr_1",
            orderId: "ord_100",
            razorpayOrderId: "rzp_ord_1",
            razorpayPaymentId: "rzp_pay_1",
            razorpaySignature: "valid_sig",
        });

        expect(result).toEqual({ success: true, orderId: "ord_100" });
    });
});
