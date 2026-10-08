import { describe, expect, it, vi } from "vitest";
import { CheckoutService } from "./checkout.service.ts";
import { AppError } from "../errors/app-error.ts";

function createMockDbClient(products: any[]) {
    return {
        from: (table: string) => {
            if (table === "products") {
                return {
                    select: () => ({
                        in: (_col: string, ids: string[]) => ({
                            data: products.filter((p) => ids.includes(p.id)),
                            error: null,
                        }),
                    }),
                };
            }
            if (table === "inventory_reservations") {
                return {
                    insert: () => ({
                        select: () => ({
                            single: () => ({ data: { id: "res_123" }, error: null }),
                        }),
                    }),
                };
            }
            if (table === "orders") {
                return {
                    insert: (record: any) => ({
                        select: () => ({
                            single: () => ({
                                data: {
                                    id: "order_999",
                                    order_number: "ORD-12345678-100",
                                    user_id: record.user_id,
                                    total_paise: record.total_paise,
                                },
                                error: null,
                            }),
                        }),
                    }),
                };
            }
            if (table === "order_items") {
                return {
                    insert: (records: any[]) => ({
                        select: () => ({ data: records, error: null }),
                    }),
                };
            }
            if (table === "payments") {
                return {
                    insert: (record: any) => ({
                        select: () => ({
                            single: () => ({ data: { id: "pay_111", ...record }, error: null }),
                        }),
                    }),
                };
            }
            return {};
        },
    } as any;
}

const mockPaymentGateway = {
    createOrder: vi.fn().mockResolvedValue({ id: "rzp_order_555", amountPaise: 10000, currency: "INR" }),
    verifyCheckoutSignature: vi.fn().mockResolvedValue(true),
    capturePayment: vi.fn().mockResolvedValue({ id: "rzp_pay_777", orderId: "rzp_order_555", amountPaise: 10000, currency: "INR", status: "captured" }),
};

describe("CheckoutService", () => {
    it("throws EMPTY_CART error when items array is empty", async () => {
        const service = new CheckoutService(createMockDbClient([]), mockPaymentGateway);
        await expect(
            service.createCheckoutSession({
                userId: "usr_1",
                items: [],
                shippingAddress: { name: "Test User" },
            }),
        ).rejects.toThrowError("Checkout items array cannot be empty");
    });

    it("throws PRODUCT_NOT_FOUND error when product does not exist in DB", async () => {
        const service = new CheckoutService(createMockDbClient([]), mockPaymentGateway);
        await expect(
            service.createCheckoutSession({
                userId: "usr_1",
                items: [{ productId: "p_missing", quantity: 1 }],
                shippingAddress: { name: "Test User" },
            }),
        ).rejects.toThrowError("Product not found: p_missing");
    });

    it("throws PRODUCT_INACTIVE error when product is not active", async () => {
        const db = createMockDbClient([{ id: "p_inactive", name: "Old Fabric", status: "draft", stock_quantity: 10, price_paise: 50000 }]);
        const service = new CheckoutService(db, mockPaymentGateway);
        await expect(
            service.createCheckoutSession({
                userId: "usr_1",
                items: [{ productId: "p_inactive", quantity: 1 }],
                shippingAddress: { name: "Test User" },
            }),
        ).rejects.toThrowError("Product is no longer active: Old Fabric");
    });

    it("throws OUT_OF_STOCK error when quantity exceeds available stock", async () => {
        const db = createMockDbClient([{ id: "p_low", name: "Silk Cutpiece", status: "active", stock_quantity: 2, price_paise: 50000 }]);
        const service = new CheckoutService(db, mockPaymentGateway);
        await expect(
            service.createCheckoutSession({
                userId: "usr_1",
                items: [{ productId: "p_low", quantity: 5 }],
                shippingAddress: { name: "Test User" },
            }),
        ).rejects.toThrowError("Insufficient stock for Silk Cutpiece. Available: 2");
    });

    it("calculates prices, shipping fee, tax, and initializes Razorpay order", async () => {
        const db = createMockDbClient([{ id: "p_100", sku: "SKU-100", name: "Raymond Wool", status: "active", stock_quantity: 10, price_paise: 50000 }]);
        const service = new CheckoutService(db, mockPaymentGateway);

        // Subtotal = 50000 (₹500). Subtotal < ₹999 -> Shipping = ₹99 (9900 paise). Tax 5% = 2500 paise. Total = 62400 paise
        const result = await service.createCheckoutSession({
            userId: "usr_1",
            items: [{ productId: "p_100", quantity: 1 }],
            shippingAddress: { name: "Test Customer", line1: "123 Main St" },
        });

        expect(result.orderId).toBe("order_999");
        expect(result.razorpayOrderId).toBe("rzp_order_555");
        expect(result.keyId).toBeDefined();
        expect(result.amountPaise).toBe(62400);
        expect(result.currency).toBe("INR");

    });

    it("applies free shipping for orders over ₹999", async () => {
        const db = createMockDbClient([{ id: "p_200", sku: "SKU-200", name: "Luxury Suit", status: "active", stock_quantity: 10, price_paise: 120000 }]);
        const service = new CheckoutService(db, mockPaymentGateway);

        // Subtotal = 120000 (₹1200 >= ₹999) -> Shipping = 0 paise. Tax 5% = 6000 paise. Total = 126000 paise
        const result = await service.createCheckoutSession({
            userId: "usr_1",
            items: [{ productId: "p_200", quantity: 1 }],
            shippingAddress: { name: "Test Customer" },
        });

        expect(result.amountPaise).toBe(126000);
    });
});
