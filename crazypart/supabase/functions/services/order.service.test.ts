import { describe, expect, it } from "vitest";
import { OrderService } from "./order.service.ts";

function createMockOrderDb(userOrders: any[], singleOrder: any) {
    return {
        from: (table: string) => {
            if (table === "orders") {
                return {
                    select: () => ({
                        eq: (_col: string, val: string) => ({
                            order: () => ({ data: userOrders, error: null }),
                            maybeSingle: () => ({ data: singleOrder && singleOrder.id === val ? singleOrder : null, error: null }),
                        }),
                    }),
                };
            }
            if (table === "order_items") {
                return {
                    select: () => ({
                        eq: () => ({ data: singleOrder?.items ?? [], error: null }),
                    }),
                };
            }
            return {};
        },
    } as any;
}

describe("OrderService", () => {
    it("returns past orders for user", async () => {
        const mockOrders = [{ id: "ord_1", user_id: "usr_1", total_paise: 50000 }];
        const service = new OrderService(createMockOrderDb(mockOrders, null));

        const orders = await service.getUserOrders("usr_1");
        expect(orders).toEqual(mockOrders);
    });

    it("returns order with items when user owns order", async () => {
        const mockSingle = { id: "ord_100", user_id: "usr_1", total_paise: 50000, items: [{ product_id: "p_1", quantity: 1 }] };
        const service = new OrderService(createMockOrderDb([], mockSingle));

        const order = await service.getOrderById("usr_1", "ord_100");
        expect(order.id).toBe("ord_100");
        expect(order.items.length).toBe(1);
    });

    it("throws FORBIDDEN error when user tries to view another user's order", async () => {
        const mockSingle = { id: "ord_100", user_id: "usr_2", total_paise: 50000, items: [] };
        const service = new OrderService(createMockOrderDb([], mockSingle));

        await expect(service.getOrderById("usr_1", "ord_100")).rejects.toThrowError("Forbidden order access");
    });

    it("throws ORDER_NOT_FOUND error when order ID does not exist", async () => {
        const service = new OrderService(createMockOrderDb([], null));

        await expect(service.getOrderById("usr_1", "ord_missing")).rejects.toThrowError("Order not found");
    });
});
