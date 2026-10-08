import { firstParam, parsePage } from "@pokedex/shared";
import { Pagination, Skeleton } from "@pokedex/ui";
import Link from "next/link";
import { Suspense } from "react";
import { PokemonCard } from "@/features/pokemon/components/PokemonCard";
import { PokemonGridSkeleton } from "@/features/pokemon/components/PokemonGridSkeleton";
import { SearchBar } from "@/features/pokemon/components/SearchBar";
import { getPokemonPage } from "@/features/pokemon/data/services/pokemon-service";

export default function PokemonListPage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Pokémon Explorer</h1>
        <Link href="/new" className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
          Add custom
        </Link>
      </header>

      {/* useSearchParams needs a Suspense boundary to keep the rest of the page prerenderable. */}
      <Suspense fallback={<Skeleton className="h-10.5 rounded-lg" />}>
        <SearchBar />
      </Suspense>

      <Suspense fallback={<PokemonGridSkeleton />}>
        <PokemonResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PokemonResults({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const result = await getPokemonPage(query, parsePage(params.page));

  const hrefForPage = (page: number) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (page > 1) next.set("page", String(page));
    const search = next.toString();
    return search ? `/?${search}` : "/";
  };

  if (result.total === 0) {
    return (
      <p className="py-16 text-center text-zinc-500">
        No pokemon match <span className="font-medium">“{query}”</span>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-zinc-500">
        {result.total.toLocaleString("en-US")} pokemon{query && ` matching “${query}”`}
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {result.items.map((pokemon) => (
          <li key={pokemon.id}>
            <PokemonCard pokemon={pokemon} />
          </li>
        ))}
      </ul>
      <Pagination page={result.page} totalPages={result.totalPages} hrefForPage={hrefForPage} />
    </div>
  );
}
