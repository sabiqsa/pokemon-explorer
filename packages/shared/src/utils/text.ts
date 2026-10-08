export function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export function displayName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
