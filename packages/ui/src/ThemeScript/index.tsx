import { THEME_STORAGE_KEY } from "../theme";

// Same logic as resolveTheme + applyTheme in ../theme, inlined as a string because it must run
// before React loads. Keep the two in sync.
const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/**
 * Put inside <head> in the root layout. Runs while the HTML is parsed, so the right theme
 * is set before the first paint (no light flash on dark mode). The <html> element needs
 * `suppressHydrationWarning` because this changes its attributes before React hydrates.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
