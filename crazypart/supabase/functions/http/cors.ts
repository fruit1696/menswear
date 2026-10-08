import { getRequiredEnv } from "../config/env.ts";

const localOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]);

function configuredOrigins(): Set<string> {
    const origins = Deno.env.get("ALLOWED_ORIGINS")
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

    return new Set(origins);
}

export function corsHeaders(request: Request): HeadersInit {
    const origin = request.headers.get("Origin");
    const allowedOrigins = configuredOrigins();
    const isLocal = origin ? localOrigins.has(origin) : false;
    const isAllowed = origin ? allowedOrigins.has(origin) || isLocal : false;

    return {
        ...(isAllowed && origin ? { "Access-Control-Allow-Origin": origin } : {}),
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-id",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin",
    };
}

export function assertProductionOriginsConfigured(): void {
    if (Deno.env.get("ENVIRONMENT") === "production") {
        getRequiredEnv("ALLOWED_ORIGINS");
    }
}
