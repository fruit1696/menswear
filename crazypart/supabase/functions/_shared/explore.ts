import { createClient } from "npm:@supabase/supabase-js@2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

export async function getUser(req: Request) {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return null;
    const client = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authorization } } },
    );
    const { data } = await client.auth.getUser();
    return data.user;
}

export function adminClient() {
    return createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
}

export function buildWhatsAppUrl(message: string) {
    const number = Deno.env.get("EXPLORE_WHATSAPP_NUMBER");
    if (!number) throw new Error("Explore WhatsApp access is not configured.");
    return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message.slice(0, 1500))}`;
}

