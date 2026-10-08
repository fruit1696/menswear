export type AppErrorOptions = {
    code: string;
    message: string;
    status: number;
    expose?: boolean;
    cause?: unknown;
    details?: unknown;
};

export class AppError extends Error {
    readonly code: string;
    readonly status: number;
    readonly expose: boolean;
    readonly details?: unknown;

    constructor(options: AppErrorOptions) {
        super(options.message, { cause: options.cause });
        this.name = "AppError";
        this.code = options.code;
        this.status = options.status;
        this.expose = options.expose ?? options.status < 500;
        this.details = options.details;
    }
}

export function asAppError(error: unknown): AppError {
    if (error instanceof AppError) return error;

    return new AppError({
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
        status: 500,
        expose: false,
        cause: error,
    });
}
