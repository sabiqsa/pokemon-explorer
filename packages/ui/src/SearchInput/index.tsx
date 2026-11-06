"use client";

import { SEARCH_DEBOUNCE_MS } from "@pokedex/shared";
import { useDebounce, useUpdateSearchParams } from "@pokedex/shared/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "../Input";
import { Spinner } from "../Spinner";

export function SearchInput({ label }: { label: string }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const updateSearchParams = useUpdateSearchParams();
  const [isSearching, startSearch] = useTransition();

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
    startSearch(() => updateSearchParams({ q: query || null, page: null }));
  }, [debounced, urlQuery, updateSearchParams]);

  const isLoading = isSearching || value.trim() !== urlQuery;

  return (
    <div className="relative">
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={`${label}…`}
        aria-label={label}
        aria-busy={isLoading || undefined}
        className="pr-9!"
      />
      {isLoading && (
        <Spinner label="Searching" className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400" />
      )}
    </div>
  );
}
