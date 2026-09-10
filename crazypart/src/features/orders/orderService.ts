import { requireSupabase } from "@/api/supabaseClient";

export async function listMyOrders(userId: string) {
    const client = requireSupabase();
    const { data: orders, error: orderError } = await client.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (orderError) throw orderError;
    if (!orders?.length) return [];

    const { data: items, error: itemError } = await client.from("order_items").select("*").in("order_id", orders.map((order) => order.id));
    if (itemError) throw itemError;
    const itemsByOrder = new Map();
    for (const item of items ?? []) itemsByOrder.set(item.order_id, [...(itemsByOrder.get(item.order_id) ?? []), item]);
    return orders.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }));
}
