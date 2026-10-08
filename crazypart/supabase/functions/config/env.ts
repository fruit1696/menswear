import { AppError } from "../errors/app-error.ts";

function readEnv(name: string): string | undefined {
    if (typeof Deno !== "undefined" && Deno?.env?.get) {
        return Deno.env.get(name)?.trim();
    }
    if (typeof process !== "undefined" && process?.env) {
        return process.env[name]?.trim();
    }
    return undefined;
}

export function getRequiredEnv(name: string): string {
    const value = readEnv(name);

    if (!value) {
        throw new AppError({
            code: "CONFIGURATION_ERROR",
            message: `Missing required environment variable: ${name}`,
            status: 500,
            expose: false,
        });
    }

    return value;
}

export function getOptionalEnv(name: string, fallback = ""): string {
    return readEnv(name) || fallback;
}


