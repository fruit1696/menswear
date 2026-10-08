import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { getRequiredEnv } from "../config/env.ts";

export function createAdminClient(): SupabaseClient {
    return createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        },
    );
}
