import { buildPageHref, displayName, firstParam, parsePage } from "@pokedex/shared";
import {
  CatalogCard,
  CatalogCount,
  CatalogEmpty,
  CatalogGrid,
  CatalogGridSkeleton,
  CatalogHeader,
  CatalogPage,
  CatalogResults,
  Pagination,
  SearchInput,
  Skeleton,
} from "@pokedex/ui";
import Link from "next/link";
import { Suspense } from "react";
import { getPokemonPage } from "@/features/pokemon/data/services/pokemon-service";

export default function PokemonListPage({ searchParams }: PageProps<"/">) {
  return (
    <CatalogPage>
      <CatalogHeader
        title="Pokémon Explorer"
        search={
          <Suspense fallback={<Skeleton className="h-10.5 rounded-lg" />}>
            <SearchInput label="Search pokemon" />
          </Suspense>
        }
        action={
          <Link href="/new" className="block rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
            Add custom
          </Link>
        }
      />

      <Suspense fallback={<CatalogGridSkeleton />}>
        <PokemonResults searchParams={searchParams} />
      </Suspense>
    </CatalogPage>
  );
}

async function PokemonResults({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const result = await getPokemonPage(query, parsePage(params.page));

  if (result.total === 0) {
    return (
      <CatalogResults>
        <CatalogEmpty>
          {query ? (
            <p>
              No pokemon match <span className="font-medium text-zinc-700 dark:text-zinc-300">“{query}”</span>.
            </p>
          ) : (
            <p>No pokemon yet.</p>
          )}
        </CatalogEmpty>
      </CatalogResults>
    );
  }

  return (
    <CatalogResults>
      <CatalogCount>
        {result.total.toLocaleString("en-US")} pokemon{query && ` matching “${query}”`}
      </CatalogCount>
      <CatalogGrid>
        {result.items.map((pokemon) => (
          <li key={pokemon.id}>
            <CatalogCard
              href={`/${pokemon.name}`}
              name={displayName(pokemon.name)}
              imageUrl={pokemon.imageUrl}
              isCustom={pokemon.isCustom}
            />
          </li>
        ))}
      </CatalogGrid>
      <Pagination page={result.page} totalPages={result.totalPages} hrefForPage={(page) => buildPageHref(query, page)} />
    </CatalogResults>
  );
}
