"use client";

import { useLayoutEffect } from "react";
import { applyTheme, resolveTheme, THEME_STORAGE_KEY } from "../theme";

/**
 * Switches between light and dark. Holds no React state: the current theme lives on
 * <html data-theme>, and the icon swaps with the `dark:` variant, so server and client
 * render the same markup.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // In dev, Strict Mode's remount resets <html> attributes and drops the one ThemeScript set.
  // Re-apply before paint. No-op in production.
  useLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, []);

  function toggle() {
    const next = resolveTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`inline-flex size-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 ${className}`}
    >
      {/* Moon in light mode (go dark), sun in dark mode (go light). */}
      <svg className="size-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="hidden size-5 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
