import { requireSupabase } from "@/api/supabaseClient";

export async function updateProfile(userId: string, values: { full_name: string; phone: string }) {
    const { data, error } = await requireSupabase()
        .from("profiles")
        .update(values)
        .eq("id", userId)
        .select("id, full_name, phone, role, created_at, updated_at")
        .single();
    if (error) throw error;
    return data;
}

export async function listAddresses(userId: string) {
    const { data, error } = await requireSupabase()
        .from("addresses").select("*").eq("user_id", userId).order("is_default", { ascending: false }).order("created_at");
    if (error) throw error;
    return data ?? [];
}

export async function saveAddress(userId: string, values) {
    const client = requireSupabase();
    if (values.is_default) {
        const { error: clearError } = await client
            .from("addresses")
            .update({ is_default: false, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        if (clearError) throw clearError;
    }
    const payload = { ...values, user_id: userId, updated_at: new Date().toISOString() };
    const request = values.id
        ? client.from("addresses").update(payload).eq("id", values.id).eq("user_id", userId).select("*").single()
        : client.from("addresses").insert(payload).select("*").single();
    const { data, error } = await request;
    if (error) throw error;
    return data;
}

export async function setDefaultAddress(userId: string, addressId: string) {
    const client = requireSupabase();
    const now = new Date().toISOString();
    const { error: clearError } = await client.from("addresses").update({ is_default: false, updated_at: now }).eq("user_id", userId);
    if (clearError) throw clearError;
    const { data, error } = await client.from("addresses").update({ is_default: true, updated_at: now }).eq("id", addressId).eq("user_id", userId).select("*").single();
    if (error) throw error;
    return data;
}

export async function deleteAddress(userId: string, addressId: string) {
    const { error } = await requireSupabase().from("addresses").delete().eq("id", addressId).eq("user_id", userId);
    if (error) throw error;
}
