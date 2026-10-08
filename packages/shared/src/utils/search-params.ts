export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePage(value: string | string[] | undefined): number {
  const page = Number.parseInt(firstParam(value) ?? '', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function buildPageHref(query: string, page: number): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const search = params.toString();
  return search ? `/?${search}` : '/';
}
