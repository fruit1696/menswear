import { asAppError } from "../errors/app-error.ts";
import { logError } from "../logging/logger.ts";
import { assertProductionOriginsConfigured } from "./cors.ts";
import { errorResponse, noContentResponse } from "./response.ts";

export type RequestContext = {
    requestId: string;
};

export type RequestHandler = (
    request: Request,
    context: RequestContext,
) => Promise<Response>;

export function createHttpHandler(handler: RequestHandler) {
    return async (request: Request): Promise<Response> => {
        const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

        try {
            assertProductionOriginsConfigured();

            if (request.method === "OPTIONS") {
                return noContentResponse(request);
            }

            return await handler(request, { requestId });
        } catch (error) {
            const appError = asAppError(error);
            logError("Request failed", error, { requestId });
            return errorResponse(request, appError, requestId);
        }
    };
}
