import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type PaymentRecord = {
    id: string;
    order_id: string;
    user_id: string;
    provider: string;
    provider_order_id: string;
    provider_payment_id: string | null;
    status: string;
    amount_paise: number;
    currency: string;
    error_message: string | null;
    created_at: string;
    updated_at: string;
};

export type CreatePaymentInput = {
    orderId: string;
    userId: string;
    provider: string;
    providerOrderId: string;
    amountPaise: number;
    currency?: string;
};

export async function createPaymentRecord(
    client: SupabaseClient,
    input: CreatePaymentInput,
): Promise<PaymentRecord> {
    const { data, error } = await client
        .from("payments")
        .insert({
            order_id: input.orderId,
            user_id: input.userId,
            provider: input.provider,
            provider_order_id: input.providerOrderId,
            status: "pending",
            amount_paise: input.amountPaise,
            currency: input.currency ?? "INR",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getPaymentByProviderOrderId(
    client: SupabaseClient,
    providerOrderId: string,
): Promise<PaymentRecord | null> {
    const { data, error } = await client
        .from("payments")
        .select("*")
        .eq("provider_order_id", providerOrderId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function updatePaymentStatus(
    client: SupabaseClient,
    paymentId: string,
    status: string,
    providerPaymentId?: string | null,
    errorMessage?: string | null,
): Promise<void> {
    const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };
    if (providerPaymentId !== undefined) {
        updateData.provider_payment_id = providerPaymentId;
    }
    if (errorMessage !== undefined) {
        updateData.error_message = errorMessage;
    }

    const { error } = await client
        .from("payments")
        .update(updateData)
        .eq("id", paymentId);

    if (error) throw error;
}
