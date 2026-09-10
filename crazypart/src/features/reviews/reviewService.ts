import { requireSupabase } from "@/api/supabaseClient";
import { listMyOrders } from "@/features/orders/orderService";

const REVIEWABLE_STATUSES = new Set(["paid", "processing", "shipped", "delivered"]);

export async function listProductReviews(productId: string) {
    const { data, error } = await requireSupabase()
        .from("reviews")
        .select("id, product_id, user_id, order_id, author_name, rating, review_text, created_at, updated_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function getReviewContext(userId: string, productId: string) {
    const orders = await listMyOrders(userId);
    const eligibleOrders = orders.filter((order) => REVIEWABLE_STATUSES.has(order.status) && order.items.some((item) => item.product_id === productId));
    const { data, error } = await requireSupabase()
        .from("reviews")
        .select("id, product_id, user_id, order_id, author_name, rating, review_text, created_at, updated_at")
        .eq("product_id", productId)
        .eq("user_id", userId)
        .maybeSingle();
    if (error) throw error;
    return { eligibleOrders, existingReview: data };
}

export async function createReview(values: { product_id: string; user_id: string; order_id: string; rating: number; review_text: string }) {
    const { data, error } = await requireSupabase()
        .from("reviews")
        .insert(values)
        .select("id, product_id, user_id, order_id, author_name, rating, review_text, created_at, updated_at")
        .single();
    if (error) throw error;
    return data;
}

export async function updateReview(reviewId: string, userId: string, values: { rating: number; review_text: string }) {
    const { data, error } = await requireSupabase()
        .from("reviews")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", reviewId)
        .eq("user_id", userId)
        .select("id, product_id, user_id, order_id, author_name, rating, review_text, created_at, updated_at")
        .single();
    if (error) throw error;
    return data;
}
