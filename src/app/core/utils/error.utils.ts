type BackendErrorPayload = {
  Message?: string;
  message?: string;
  mensaje?: string;
  Errors?: Record<string, string[]> | string[] | null;
  errors?: Record<string, string[]> | string[] | null;
};

export interface ErrorDetails {
  message: string;
  errors: string[];
}

function normalizeErrors(value: Record<string, string[]> | string[] | null | undefined): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  return Object.values(value)
    .flat()
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export function resolveErrorDetails(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): ErrorDetails {
  const payload = (error as { error?: BackendErrorPayload })?.error;

  if (!payload) return { message: fallback, errors: [] };

  const message = payload.Message || payload.message || payload.mensaje || fallback;
  const errors = normalizeErrors(payload.Errors ?? payload.errors);

  return { message, errors };
}

export function resolveErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  const payload = (error as { error?: BackendErrorPayload })?.error;

  if (!payload) return fallback;

  const message = payload.Message || payload.message || payload.mensaje;
  if (message) return message;

  const errors = normalizeErrors(payload.Errors ?? payload.errors);
  return errors[0] ?? fallback;
}
