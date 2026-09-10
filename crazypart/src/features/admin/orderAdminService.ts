import { requireSupabase } from "@/api/supabaseClient";
import type { Database } from "@/api/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

export async function listAdminOrders(): Promise<Order[]> {
    const { data, error } = await requireSupabase().from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function updateAdminOrderStatus(orderId: string, nextStatus: string) {
    const { data, error } = await requireSupabase().rpc("update_order_status", {
        p_order_id: orderId,
        p_next_status: nextStatus,
    });
    if (error) throw error;
    return data;
}
