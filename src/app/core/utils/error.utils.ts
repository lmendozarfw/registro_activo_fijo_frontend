type BackendErrorPayload = {
    Message?: string;
    message?: string;
    mensaje?: string;
    Errors?: Record<string, string[]> | null;
};

export function resolveErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
    const payload = (error as { error?: BackendErrorPayload })?.error;

    if (!payload) return fallback;

    if (payload.Message) return payload.Message;
    if (payload.message) return payload.message;
    if (payload.mensaje) return payload.mensaje;

    if (payload.Errors) {
        const first = Object.values(payload.Errors).flat()[0];
        if (first) return first;
    }

    return fallback;
}
