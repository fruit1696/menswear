import type { ZodType } from "npm:zod@3.24.2";
import { AppError } from "../errors/app-error.ts";

export async function parseJson<T>(
    request: Request,
    schema: ZodType<T>,
): Promise<T> {
    let body: unknown;

    try {
        body = await request.json();
    } catch (error) {
        throw new AppError({
            code: "INVALID_JSON",
            message: "The request body must be valid JSON.",
            status: 400,
            cause: error,
        });
    }

    const result = schema.safeParse(body);

    if (!result.success) {
        throw new AppError({
            code: "VALIDATION_ERROR",
            message: "The request contains invalid data.",
            status: 400,
            details: result.error.flatten().fieldErrors,
        });
    }

    return result.data;
}
