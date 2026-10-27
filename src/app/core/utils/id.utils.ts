export function unwrapId(raw: string): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) return '';

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (typeof parsed === 'string') return parsed;

    if (parsed && typeof parsed === 'object' && 'id' in parsed) {
      const id = (parsed as { id?: unknown }).id;
      if (typeof id === 'string') return id;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}
