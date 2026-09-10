import { requireSupabase } from "@/api/supabaseClient";
import { mergeCartItems, normalizeQuantity } from "@/features/cart/cartDomain";

async function getOrCreateActiveCart(userId: string) {
    const client = requireSupabase();
    const { data: existing, error: selectError } = await client
        .from("carts").select("id").eq("user_id", userId).eq("status", "active").maybeSingle();
    if (selectError) throw selectError;
    if (existing) return existing.id;

    const { data: created, error: createError } = await client
        .from("carts").insert({ user_id: userId, status: "active" }).select("id").single();
    if (createError) throw createError;
    return created.id;
}

export async function readUserCart(userId: string) {
    const client = requireSupabase();
    const cartId = await getOrCreateActiveCart(userId);
    const { data, error } = await client.from("cart_items").select("product_id, quantity").eq("cart_id", cartId);
    if (error) throw error;
    return { cartId, items: (data ?? []).map((item) => ({ productId: item.product_id, quantity: item.quantity })) };
}

export async function saveUserCart(userId: string, items) {
    const client = requireSupabase();
    const cartId = await getOrCreateActiveCart(userId);
    const nextItems = mergeCartItems(items);
    const { error: deleteError } = await client.from("cart_items").delete().eq("cart_id", cartId);
    if (deleteError) throw deleteError;
    if (nextItems.length) {
        const { error } = await client.from("cart_items").insert(nextItems.map((item) => ({
            cart_id: cartId, product_id: item.productId, quantity: normalizeQuantity(item.quantity),
        })));
        if (error) throw error;
    }
    return { cartId, items: nextItems };
}
