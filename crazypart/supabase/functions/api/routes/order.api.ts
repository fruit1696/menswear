import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { jsonResponse } from "../../http/response.ts";
import { OrderService } from "../../services/order.service.ts";
import { AppError } from "../../errors/app-error.ts";

/**
 * USER ORDERS API ROUTE HANDLER (`GET /api/orders`)
 *
 * Execution Workflow & Security Steps:
 *
 * 1. HTTP Method Check: Ensures request is GET.
 * 2. Business Service Delegation (`OrderService.getUserOrders`):
 *    - Queries `public.orders` for `user_id = userId`.
 *    - Applies user identity isolation so customers only receive their own past orders.
 * 3. Response: Returns `{ orders: OrderRecord[] }` with HTTP 200 OK.
 */
export async function handleGetOrders(
    request: Request,
    userId: string,
    dbClient: SupabaseClient,
): Promise<Response> {
    // Step 1: Enforce HTTP GET
    if (request.method !== "GET") {
        throw new AppError({ message: "Method not allowed", status: 405, code: "METHOD_NOT_ALLOWED", expose: true });
    }

    // Step 2: Fetch orders for authenticated user
    const orderService = new OrderService(dbClient);
    const orders = await orderService.getUserOrders(userId);

    // Step 3: Return JSON array
    return jsonResponse(request, { orders }, 200);
}

/**
 * SINGLE ORDER DETAIL API ROUTE HANDLER (`GET /api/orders/:id`)
 *
 * Execution Workflow & Security Steps:
 *
 * 1. HTTP Method Check: Ensures request is GET.
 * 2. Parameter Check: Validates presence of `orderId`.
 * 3. Business Service Delegation (`OrderService.getOrderById`):
 *    - Fetches order record and associated line items (`order_items`).
 *    - Validates ownership (`order.user_id === userId`). Returns 403 Forbidden if user attempts to view another user's order.
 * 4. Response: Returns `{ order: OrderRecord & { items: OrderItemRecord[] } }` with HTTP 200 OK.
 */
export async function handleGetOrderById(
    request: Request,
    userId: string,
    orderId: string,
    dbClient: SupabaseClient,
): Promise<Response> {
    // Step 1: Enforce HTTP GET
    if (request.method !== "GET") {
        throw new AppError({ message: "Method not allowed", status: 405, code: "METHOD_NOT_ALLOWED", expose: true });
    }

    // Step 2: Validate orderId parameter
    if (!orderId) {
        throw new AppError({ message: "Order ID required", status: 400, code: "MISSING_ORDER_ID", expose: true });
    }


    // Step 3: Fetch order with line items and verify user ownership
    const orderService = new OrderService(dbClient);
    const order = await orderService.getOrderById(userId, orderId);

    // Step 4: Return single order JSON object
    return jsonResponse(request, { order }, 200);
}

