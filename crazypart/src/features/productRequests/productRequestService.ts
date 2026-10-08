import { requireSupabase } from "@/api/supabaseClient";
import type { Json } from "@/api/database.types";

export type ProductOptionRequestStatus = "new" | "checking" | "replied" | "closed";

export type ProductOptionRequestInput = {
    user_id: string;
    product_id: string;
    product_name: string;
    product_image?: string | null;
    product_details: Json;
    requested_color?: string | null;
    requested_pattern?: string | null;
    customer_note?: string | null;
};

export async function createProductOptionRequest(input: ProductOptionRequestInput) {
    const { data, error } = await requireSupabase()
        .from("product_option_requests")
        .insert(input)
        .select("*")
        .single();
    if (error) throw error;
    return data;
}

export async function listMyProductOptionRequests(userId: string) {
    const { data, error } = await requireSupabase()
        .from("product_option_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function listAdminProductOptionRequests() {
    const client = requireSupabase();
    const { data, error } = await client
        .from("product_option_requests")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    const requests = data ?? [];
    if (!requests.length) return [];
    const { data: profiles, error: profileError } = await client
        .from("profiles")
        .select("id, full_name")
        .in("id", [...new Set(requests.map((request) => request.user_id))]);
    if (profileError) throw profileError;
    const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));
    return requests.map((request) => ({ ...request, customer_name: names.get(request.user_id) ?? "Customer" }));
}

export async function updateProductOptionRequest(
    requestId: string,
    update: { status: ProductOptionRequestStatus; admin_reply: string | null },
) {
    const { data, error } = await requireSupabase()
        .from("product_option_requests")
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq("id", requestId)
        .select("*")
        .single();
    if (error) throw error;
    return data;
}
