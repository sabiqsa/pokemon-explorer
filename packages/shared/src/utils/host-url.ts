export function hostUrl(path: string, base?: string): string {
  const normalizedPath = `/${path.replace(/^\/+/, '')}`;
  const normalizedBase = base?.trim().replace(/\/+$/, '');
  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
}
