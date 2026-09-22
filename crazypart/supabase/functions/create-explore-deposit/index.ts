import { adminClient, corsHeaders, getUser, json } from "../_shared/explore.ts";

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    try {
        const user = await getUser(req);
        if (!user) return json({ error: "Authentication required" }, 401);

        const admin = adminClient();
        const { data: existing } = await admin
            .from("explore_deposits")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "captured")
            .limit(1)
            .maybeSingle();
        if (existing) return json({ access_granted: true });

        const keyId = Deno.env.get("RAZORPAY_KEY_ID");
        const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
        if (!keyId || !keySecret) throw new Error("Razorpay is not configured.");

        const receipt = `explore_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: 10000, currency: "INR", receipt }),
        });
        if (!response.ok) throw new Error("Unable to create the payment order.");
        const order = await response.json();

        const { data: deposit, error } = await admin.from("explore_deposits").insert({
            user_id: user.id,
            razorpay_order_id: order.id,
        }).select("id").single();
        if (error) throw error;

        return json({
            deposit_id: deposit.id,
            key_id: keyId,
            order_id: order.id,
            amount: 10000,
            currency: "INR",
        });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Unable to start payment." }, 500);
    }
});

