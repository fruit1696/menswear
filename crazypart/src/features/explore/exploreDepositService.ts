import { requireSupabase } from "@/api/supabaseClient";

type ExploreAccess = { access_granted: boolean; whatsapp_url?: string };

async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T> {
    const { data, error } = await requireSupabase().functions.invoke(name, { body });
    if (error) throw new Error(error.message || "The secure payment service is unavailable.");
    if (data?.error) throw new Error(data.error);
    return data as T;
}

export async function getExploreAccess(message: string) {
    return invoke<ExploreAccess>("get-explore-access", { message });
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

export async function payExploreDeposit({ message, email }: { message: string; email?: string }) {
    const order = await invoke<{
        access_granted?: boolean;
        deposit_id?: string;
        key_id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
    }>("create-explore-deposit", {});

    if (order.access_granted) return getExploreAccess(message);
    await loadRazorpay();

    return new Promise<ExploreAccess>((resolve, reject) => {
        const razorpay = new (window as any).Razorpay({
            key: order.key_id,
            amount: order.amount,
            currency: order.currency,
            order_id: order.order_id,
            name: "Crazy Cutpiece",
            description: "₹100 refundable Explore More deposit",
            prefill: { email },
            theme: { color: "#1E5E41" },
            modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
            handler: async (response: Record<string, string>) => {
                try {
                    resolve(await invoke<ExploreAccess>("verify-explore-deposit", {
                        deposit_id: order.deposit_id,
                        message,
                        ...response,
                    }));
                } catch (error) {
                    reject(error);
                }
            },
        });
        razorpay.on("payment.failed", (response: any) => reject(new Error(response.error?.description || "Payment failed.")));
        razorpay.open();
    });
}

