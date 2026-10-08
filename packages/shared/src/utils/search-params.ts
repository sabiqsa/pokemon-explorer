/** Read a single string from a Next.js `searchParams` value. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Parse a positive page number, falling back to 1 for anything invalid. */
export function parsePage(value: string | string[] | undefined): number {
  const page = Number.parseInt(firstParam(value) ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}
