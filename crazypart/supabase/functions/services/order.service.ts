import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { AppError } from "../errors/app-error.ts";
import { getOrderById, getUserOrders, type OrderRecord, type OrderItemRecord } from "../dao/order.dao.ts";

export class OrderService {
    constructor(private dbClient: SupabaseClient) {}

    async getUserOrders(userId: string): Promise<OrderRecord[]> {
        return await getUserOrders(this.dbClient, userId);
    }

    async getOrderById(
        userId: string,
        orderId: string,
    ): Promise<OrderRecord & { items: OrderItemRecord[] }> {
        const order = await getOrderById(this.dbClient, orderId);
        if (!order) {
            throw new AppError({ message: "Order not found", status: 404, code: "ORDER_NOT_FOUND", expose: true });
        }
        if (order.user_id !== userId) {
            throw new AppError({ message: "Forbidden order access", status: 403, code: "FORBIDDEN", expose: true });
        }

        return order;
    }
}
