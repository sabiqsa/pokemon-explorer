/** "  Mr Mime " -> "mr-mime", matching PokéAPI's hyphenated names. */
export function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

/** "mr-mime" -> "Mr Mime" */
export function displayName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** "25" -> "#0025"; custom IDs get a label instead of a number. */
export function displayId(id: string, isCustom: boolean): string {
  return isCustom ? "Custom" : `#${id.padStart(4, "0")}`;
}
