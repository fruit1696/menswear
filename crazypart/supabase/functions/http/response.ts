import { AppError } from "../errors/app-error.ts";
import { corsHeaders } from "./cors.ts";

export type ErrorBody = {
    error: {
        code: string;
        message: string;
        requestId: string;
        details?: unknown;
    };
};

export function jsonResponse(
    request: Request,
    body: unknown,
    status = 200,
): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders(request),
            "Content-Type": "application/json; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

export function errorResponse(
    request: Request,
    error: AppError,
    requestId: string,
): Response {
    const body: ErrorBody = {
        error: {
            code: error.expose ? error.code : "INTERNAL_ERROR",
            message: error.expose ? error.message : "An unexpected error occurred.",
            requestId,
            ...(error.expose && error.details !== undefined
                ? { details: error.details }
                : {}),
        },
    };

    return jsonResponse(request, body, error.status);
}

export function noContentResponse(request: Request): Response {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
}
