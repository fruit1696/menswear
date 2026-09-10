import { requireSupabase } from "@/api/supabaseClient";

export async function createPendingOrder(items, shippingAddress) {
    const { data, error } = await requireSupabase().rpc("create_pending_order", {
        p_items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
        p_shipping_address: shippingAddress,
    });

    if (error) throw error;
    return data;
}
