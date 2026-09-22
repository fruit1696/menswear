import { adminClient, buildWhatsAppUrl, corsHeaders, getUser, json } from "../_shared/explore.ts";

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    try {
        const user = await getUser(req);
        if (!user) return json({ error: "Authentication required" }, 401);
        const { message = "Hi, I would like to explore more fabrics." } = await req.json().catch(() => ({}));
        const { data } = await adminClient().from("explore_deposits")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "captured")
            .limit(1)
            .maybeSingle();
        if (!data) return json({ access_granted: false });
        return json({ access_granted: true, whatsapp_url: buildWhatsAppUrl(message) });
    } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Unable to check access." }, 500);
    }
});
