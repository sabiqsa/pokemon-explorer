"use client";

import { useDebounce, useUpdateSearchParams } from "@pokedex/shared/hooks";
import { Input } from "@pokedex/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/features/pokemon/config/constants";

/** Writes `?q=` to the URL as the user types. The server page reads it and re-renders. */
export function SearchBar() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const updateSearchParams = useUpdateSearchParams();

  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  // URL changed from outside (back/forward, a link): show that query in the input.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  const debounced = useDebounce(value, SEARCH_DEBOUNCE_MS);
  const lastDebounced = useRef(debounced);

  useEffect(() => {
    // Only react to the user's typing settling, not to URL changes, or back/forward
    // would be overwritten by the stale debounced value.
    if (debounced === lastDebounced.current) return;
    lastDebounced.current = debounced;

    const query = debounced.trim();
    if (query === urlQuery) return;
    // A new search starts from page 1.
    updateSearchParams({ q: query || null, page: null });
  }, [debounced, urlQuery, updateSearchParams]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search pokemon…"
      aria-label="Search pokemon"
    />
  );
}
