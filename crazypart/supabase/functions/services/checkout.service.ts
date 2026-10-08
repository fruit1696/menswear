import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { AppError } from "../errors/app-error.ts";
import {
    createInventoryReservation,
    decrementProductStock,
    getProductsByIds,
} from "../dao/product.dao.ts";
import { createOrderRecord, createOrderItemRecords } from "../dao/order.dao.ts";
import { createPaymentRecord } from "../dao/payment.dao.ts";
import { RazorpayGateway } from "../integrations/razorpay/razorpay.client.ts";
import type { PaymentGateway } from "../integrations/razorpay/razorpay.types.ts";

import { getOptionalEnv } from "../config/env.ts";

export type CheckoutItemInput = {
    productId: string;
    quantity: number;
};

export type CreateCheckoutInput = {
    userId: string;
    items: CheckoutItemInput[];
    shippingAddress: Record<string, unknown>;
    billingAddress?: Record<string, unknown>;
};

export type CheckoutSessionResult = {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    keyId: string;
    amountPaise: number;
    currency: string;
};

export class CheckoutService {
    constructor(
        private dbClient: SupabaseClient,
        private paymentGateway: PaymentGateway = new RazorpayGateway(),
    ) {}

    async createCheckoutSession(input: CreateCheckoutInput): Promise<CheckoutSessionResult> {
        if (!input.items || !input.items.length) {
            throw new AppError({ message: "Checkout items array cannot be empty", status: 400, code: "EMPTY_CART", expose: true });
        }

        const productIds = input.items.map((i) => i.productId);
        const products = await getProductsByIds(this.dbClient, productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));

        let subtotalPaise = 0;
        const orderItemInputs = [];

        for (const item of input.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new AppError({ message: `Product not found: ${item.productId}`, status: 404, code: "PRODUCT_NOT_FOUND", expose: true });
            }
            if (product.status !== "active") {
                throw new AppError({ message: `Product is no longer active: ${product.name}`, status: 400, code: "PRODUCT_INACTIVE", expose: true });
            }
            if (product.stock_quantity < item.quantity) {
                throw new AppError({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`,
                    status: 400,
                    code: "OUT_OF_STOCK",
                    expose: true,
                });
            }

            const itemSubtotal = product.price_paise * item.quantity;
            subtotalPaise += itemSubtotal;

            orderItemInputs.push({
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                quantity: item.quantity,
                unitPricePaise: product.price_paise,
                totalPricePaise: itemSubtotal,
            });

            // Create inventory reservation (15-min hold)
            await createInventoryReservation(this.dbClient, product.id, input.userId, item.quantity, 15);
        }

        // Calculate shipping: Free above ₹999 (99900 paise), else ₹99 (9900 paise)
        const shippingPaise = subtotalPaise >= 99900 ? 0 : 9900;
        // Calculate tax: 5% GST included or added
        const taxPaise = Math.round(subtotalPaise * 0.05);
        const totalPaise = subtotalPaise + shippingPaise + taxPaise;

        // 1. Create order record
        const order = await createOrderRecord(this.dbClient, {
            userId: input.userId,
            subtotalPaise,
            shippingPaise,
            taxPaise,
            totalPaise,
            currency: "INR",
            shippingAddress: input.shippingAddress,
            billingAddress: input.billingAddress,
        });

        // 2. Create order item records
        await createOrderItemRecords(
            this.dbClient,
            orderItemInputs.map((item) => ({ ...item, orderId: order.id })),
        );

        // 3. Create payment order in Razorpay
        const razorpayOrder = await this.paymentGateway.createOrder({
            amountPaise: totalPaise,
            currency: "INR",
            receipt: order.order_number,
        });

        // 4. Create payment record
        await createPaymentRecord(this.dbClient, {
            orderId: order.id,
            userId: input.userId,
            provider: "razorpay",
            providerOrderId: razorpayOrder.id,
            amountPaise: totalPaise,
            currency: "INR",
        });

        const keyId = getOptionalEnv("RAZORPAY_KEY_ID", "rzp_test_placeholder");

        return {
            orderId: order.id,
            orderNumber: order.order_number,
            razorpayOrderId: razorpayOrder.id,
            keyId,
            amountPaise: totalPaise,
            currency: "INR",
        };
    }
}

