import { createClient, type User } from "npm:@supabase/supabase-js@2";
import { getRequiredEnv } from "../config/env.ts";
import { AppError } from "../errors/app-error.ts";

export type AuthenticatedUser = Pick<User, "id" | "email" | "app_metadata" | "user_metadata">;

export async function authenticateRequest(request: Request): Promise<AuthenticatedUser> {
    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        throw new AppError({
            code: "AUTHENTICATION_REQUIRED",
            message: "Authentication is required.",
            status: 401,
        });
    }

    const client = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_ANON_KEY"),
        {
            global: { headers: { Authorization: authorization } },
            auth: { autoRefreshToken: false, persistSession: false },
        },
    );
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
        throw new AppError({
            code: "INVALID_SESSION",
            message: "The session is invalid or expired.",
            status: 401,
            cause: error,
        });
    }

    return data.user;
}
