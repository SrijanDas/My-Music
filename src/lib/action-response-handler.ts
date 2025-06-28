export function handleError(error: unknown): {
    data: null;
    error: string;
} {
    return {
        data: null,
        error: error instanceof Error ? error.message : "Something went wrong",
    };
}

export function handleSuccess<T>(data: T): {
    data: T;
    error: null;
} {
    return {
        data,
        error: null,
    };
}
