type LogContext = Record<string, string | number | boolean | null | undefined>;

export function logInfo(message: string, context: LogContext = {}): void {
    console.info(JSON.stringify({ level: "info", message, ...context }));
}

export function logError(
    message: string,
    error: unknown,
    context: LogContext = {},
): void {
    console.error(JSON.stringify({
        level: "error",
        message,
        errorName: error instanceof Error ? error.name : "UnknownError",
        ...context,
    }));
}
