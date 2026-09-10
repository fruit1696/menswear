import { requireSupabase } from "@/api/supabaseClient";
import type { Database } from "@/api/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Inventory = Database["public"]["Tables"]["inventory"]["Row"];

export type AdminProduct = Product & { inventory: Inventory | null };

export async function listAdminProducts(): Promise<AdminProduct[]> {
    const client = requireSupabase();
    const [{ data: products, error: productsError }, { data: inventory, error: inventoryError }] = await Promise.all([
        client.from("products").select("*").order("created_at", { ascending: false }),
        client.from("inventory").select("*")
    ]);

    if (productsError) throw productsError;
    if (inventoryError) throw inventoryError;

    const inventoryByProduct = new Map((inventory ?? []).map((item) => [item.product_id, item]));
    return (products ?? []).map((product) => ({
        ...product,
        inventory: inventoryByProduct.get(product.id) ?? null,
    }));
}

export async function updateProductInventory(productId: string, stockQuantity: number) {
    const { error } = await requireSupabase()
        .from("inventory")
        .upsert({ product_id: productId, stock_quantity: stockQuantity, updated_at: new Date().toISOString() });

    if (error) throw error;
}

export async function updateAdminProduct(productId: string, values) {
    const { data, error } = await requireSupabase()
        .from("products")
        .update(values)
        .eq("id", productId)
        .select("*")
        .single();

    if (error) throw error;
    return data;
}
