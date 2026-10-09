const KEY_PREFIX = "list-search:";

function parentPath(pathname: string): string {
  return pathname.replace(/\/[^/]*$/, "") || "/";
}

export function rememberListSearch(): void {
  try {
    sessionStorage.setItem(KEY_PREFIX + window.location.pathname, window.location.search);
  } catch {}
}

export function readListSearch(): string {
  try {
    return sessionStorage.getItem(KEY_PREFIX + parentPath(window.location.pathname)) ?? "";
  } catch {
    return "";
  }
}
