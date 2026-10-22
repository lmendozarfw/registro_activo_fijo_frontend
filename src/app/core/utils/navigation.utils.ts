export function safeReturnUrl(value: string | null | undefined): string | null {
  const url = value?.trim();
  if (!url || !url.startsWith('/') || url.startsWith('//')) return null;
  return url;
}
