import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export type OrderRecord = {
    id: string;
    order_number: string;
    user_id: string;
    status: string;
    subtotal_paise: number;
    shipping_paise: number;
    discount_paise: number;
    tax_paise: number;
    total_paise: number;
    currency: string;
    shipping_address: Record<string, unknown>;
    billing_address?: Record<string, unknown> | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
};

export type OrderItemRecord = {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    sku: string;
    quantity: number;
    unit_price_paise: number;
    total_price_paise: number;
    created_at: string;
};

export type CreateOrderInput = {
    userId: string;
    subtotalPaise: number;
    shippingPaise: number;
    taxPaise: number;
    totalPaise: number;
    currency?: string;
    shippingAddress: Record<string, unknown>;
    billingAddress?: Record<string, unknown>;
};

export type CreateOrderItemInput = {
    orderId: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPricePaise: number;
    totalPricePaise: number;
};

export async function createOrderRecord(
    client: SupabaseClient,
    input: CreateOrderInput,
): Promise<OrderRecord> {
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
    const { data, error } = await client
        .from("orders")
        .insert({
            user_id: input.userId,
            order_number: orderNumber,
            status: "pending_payment",
            subtotal_paise: input.subtotalPaise,
            shipping_paise: input.shippingPaise,
            discount_paise: 0,
            tax_paise: input.taxPaise,
            total_paise: input.totalPaise,
            currency: input.currency ?? "INR",
            shipping_address: input.shippingAddress,
            billing_address: input.billingAddress ?? input.shippingAddress,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function createOrderItemRecords(
    client: SupabaseClient,
    items: CreateOrderItemInput[],
): Promise<OrderItemRecord[]> {
    const records = items.map((item) => ({
        order_id: item.orderId,
        product_id: item.productId,
        product_name: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unit_price_paise: item.unitPricePaise,
        total_price_paise: item.totalPricePaise,
    }));

    const { data, error } = await client
        .from("order_items")
        .insert(records)
        .select();

    if (error) throw error;
    return data ?? [];
}

export async function getOrderById(
    client: SupabaseClient,
    orderId: string,
): Promise<(OrderRecord & { items: OrderItemRecord[] }) | null> {
    const { data: order, error: orderErr } = await client
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

    if (orderErr) throw orderErr;
    if (!order) return null;

    const { data: items, error: itemsErr } = await client
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

    if (itemsErr) throw itemsErr;

    return {
        ...order,
        items: items ?? [],
    };
}

export async function getUserOrders(
    client: SupabaseClient,
    userId: string,
): Promise<OrderRecord[]> {
    const { data, error } = await client
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function updateOrderStatus(
    client: SupabaseClient,
    orderId: string,
    status: string,
): Promise<void> {
    const { error } = await client
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

    if (error) throw error;
}
