import { buildPageHref, displayName, firstParam, parsePage } from "@pokedex/shared";
import {
  CatalogAddLink,
  CatalogCard,
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
        subtitle={
          <Suspense fallback={<Skeleton className="mt-1 h-4 w-24 rounded" />}>
            <PokemonCount searchParams={searchParams} />
          </Suspense>
        }
        action={<CatalogAddLink href="/new" label="Add custom pokemon" />}
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

async function PokemonCount({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const { total } = await getPokemonPage(query, parsePage(params.page));

  return (
    <p>
      {total.toLocaleString("en-US")} pokemon
      {query && ` matching “${query}”`}
    </p>
  );
}
