"use client";

import { SEARCH_DEBOUNCE_MS } from "@pokedex/shared";
import { useDebounce, useUpdateSearchParams } from "@pokedex/shared/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../Input";

export function SearchInput({ label }: { label: string }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const updateSearchParams = useUpdateSearchParams();

  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  const debounced = useDebounce(value, SEARCH_DEBOUNCE_MS);
  const lastDebounced = useRef(debounced);

  useEffect(() => {
    if (debounced === lastDebounced.current) return;
    lastDebounced.current = debounced;

    const query = debounced.trim();
    if (query === urlQuery) return;
    updateSearchParams({ q: query || null, page: null });
  }, [debounced, urlQuery, updateSearchParams]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder={`${label}…`}
      aria-label={label}
    />
  );
}
