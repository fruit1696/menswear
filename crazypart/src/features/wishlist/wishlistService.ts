import { requireSupabase } from "@/api/supabaseClient";

export async function listWishlistProductIds(userId: string) {
    const { data, error } = await requireSupabase()
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);

    if (error) throw error;
    return (data ?? []).map((item) => item.product_id);
}

export async function addWishlistItem(userId: string, productId: string) {
    const { error } = await requireSupabase()
        .from("wishlists")
        .insert({ user_id: userId, product_id: productId });

    if (error) throw error;
}

export async function removeWishlistItem(userId: string, productId: string) {
    const { error } = await requireSupabase()
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

    if (error) throw error;
}
