/** "25" -> "#0025"; custom IDs get a label instead of a number. */
export function displayId(id: string, isCustom: boolean): string {
  return isCustom ? "Custom" : `#${id.padStart(4, "0")}`;
}
