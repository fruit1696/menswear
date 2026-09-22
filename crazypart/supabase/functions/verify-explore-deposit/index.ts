import { adminClient, buildWhatsAppUrl, corsHeaders, getUser, json } from "../_shared/explore.ts";

async function hmacHex(value: string, secret: string) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
    return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    try {
        const user = await getUser(req);
        if (!user) return json({ error: "Authentication required" }, 401);
        const body = await req.json();
        const { deposit_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, message = "Hi, I would like to explore more fabrics." } = body;
        if (![deposit_id, razorpay_order_id, razorpay_payment_id, razorpay_signature].every(Boolean)) {
            return json({ error: "Incomplete payment confirmation." }, 400);
        }

        const admin = adminClient();
        const { data: deposit } = await admin.from("explore_deposits")
            .select("id, user_id, amount_paise, razorpay_order_id, status")
            .eq("id", deposit_id)
            .eq("user_id", user.id)
            .maybeSingle();
        if (!deposit || deposit.razorpay_order_id !== razorpay_order_id) return json({ error: "Invalid deposit." }, 400);

        const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
        const keyId = Deno.env.get("RAZORPAY_KEY_ID");
        if (!secret || !keyId) throw new Error("Razorpay is not configured.");
        const expected = await hmacHex(`${razorpay_order_id}|${razorpay_payment_id}`, secret);
        if (expected !== razorpay_signature) return json({ error: "Payment verification failed." }, 400);

        const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
            headers: { Authorization: `Basic ${btoa(`${keyId}:${secret}`)}` },
        });
        if (!paymentResponse.ok) throw new Error("Unable to confirm payment with Razorpay.");
        let payment = await paymentResponse.json();
        if (payment.order_id !== razorpay_order_id || payment.amount !== 10000 || payment.currency !== "INR") {
            return json({ error: "Payment details do not match this deposit." }, 400);
        }
        if (payment.status === "authorized") {
            const captureResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}/capture`, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${btoa(`${keyId}:${secret}`)}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: 10000, currency: "INR" }),
            });
            if (!captureResponse.ok) throw new Error("Unable to capture the payment.");
            payment = await captureResponse.json();
        }
        if (payment.status !== "captured") {
            return json({ error: "Payment has not been captured." }, 400);
        }

        const { error } = await admin.from("explore_deposits").update({
            status: "captured",
            razorpay_payment_id,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).eq("id", deposit.id).eq("user_id", user.id);
        if (error) throw error;

        return json({ access_granted: true, whatsapp_url: buildWhatsAppUrl(message) });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Unable to verify payment." }, 500);
    }
});
