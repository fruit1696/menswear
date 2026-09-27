import { requireSupabase } from "@/api/supabaseClient";

export async function createPendingOrder(items, shippingAddress) {
    const { data, error } = await requireSupabase().rpc("create_pending_order", {
        p_items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
        p_shipping_address: shippingAddress,
    });

    if (error) throw error;
    return data;
}

async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T> {
    const { data, error } = await requireSupabase().functions.invoke(name, { body });
    if (error) throw new Error(error.message || "The secure payment service is unavailable.");
    if (data?.error) throw new Error(data.error);
    return data as T;
}

function loadRazorpay() {
    if ((window as any).Razorpay) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Unable to load the secure payment window."));
        document.head.appendChild(script);
    });
}

export async function createOrderAndPay({ items, shippingAddress, customer }: { items: any[]; shippingAddress: any; customer: { name?: string; email?: string; phone?: string } }) {
    const order = await createPendingOrder(items, shippingAddress) as any;
    try {
        const payment = await invoke<any>("create-order-payment", { order_id: order.id });
        await loadRazorpay();
        return await new Promise<any>((resolve, reject) => {
            const razorpay = new (window as any).Razorpay({
                key: payment.key_id,
                amount: payment.amount,
                currency: payment.currency,
                order_id: payment.razorpay_order_id,
                name: "Crazy Cutpiece",
                description: `Order ${payment.order_number}`,
                prefill: customer,
                theme: { color: "#1E5E41" },
                modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
                handler: async (response: Record<string, string>) => {
                    try {
                        resolve(await invoke("verify-order-payment", { order_id: order.id, ...response }));
                    } catch (error) {
                        reject(error);
                    }
                },
            });
            razorpay.on("payment.failed", (response: any) => reject(new Error(response.error?.description || "Payment failed.")));
            razorpay.open();
        });
    } catch (error) {
        try {
            await requireSupabase().rpc("cancel_pending_order", { p_order_id: order.id });
        } catch {
            // The server expiration job will release stock if cancellation cannot be reached.
        }
        throw error;
    }
}
