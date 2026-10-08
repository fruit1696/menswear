import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type ProductRecord = {
    id: string;
    name: string;
    sku: string;
    price_paise: number;
    stock_quantity: number;
    status: string;
};

export async function getProductsByIds(
    client: SupabaseClient,
    productIds: string[],
): Promise<ProductRecord[]> {
    const { data, error } = await client
        .from("products")
        .select("id, name, sku, price_paise, stock_quantity, status")
        .in("id", productIds);

    if (error) throw error;
    return data ?? [];
}

export async function createInventoryReservation(
    client: SupabaseClient,
    productId: string,
    userId: string,
    quantity: number,
    expiresMinutes = 15,
): Promise<string> {
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000).toISOString();
    const { data, error } = await client
        .from("inventory_reservations")
        .insert({
            product_id: productId,
            user_id: userId,
            quantity,
            expires_at: expiresAt,
            status: "active",
        })
        .select("id")
        .single();

    if (error) throw error;
    return data.id;
}

export async function decrementProductStock(
    client: SupabaseClient,
    productId: string,
    quantity: number,
): Promise<void> {
    const { data: product, error: fetchErr } = await client
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();

    if (fetchErr) throw fetchErr;

    const newStock = Math.max(0, (product.stock_quantity ?? 0) - quantity);
    const { error: updateErr } = await client
        .from("products")
        .update({ stock_quantity: newStock, updated_at: new Date().toISOString() })
        .eq("id", productId);

    if (updateErr) throw updateErr;
}
