export type Theme = "light" | "dark";

/** localStorage key. Shared by every zone because they all load through the host's origin. */
export const THEME_STORAGE_KEY = "theme";

/** Saved choice, or the OS preference when the user hasn't picked one. */
export function resolveTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}
