import { buildPageHref, firstParam, parsePage } from "@pokedex/shared";
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
import { berryDisplayName } from "@/features/berries/utils/helper";
import { getBerryPage } from "@/features/berries/data/services/berry-service";

export default function BerryListPage({ searchParams }: PageProps<"/">) {
  return (
    <CatalogPage>
      <CatalogHeader
        title="Berries Explorer"
        search={
          <Suspense fallback={<Skeleton className="h-10.5 rounded-lg" />}>
            <SearchInput label="Search berries" />
          </Suspense>
        }
        subtitle={
          <Suspense fallback={<Skeleton className="mt-1 h-4 w-24 rounded" />}>
            <BerryCount searchParams={searchParams} />
          </Suspense>
        }
        action={<CatalogAddLink href="/new" label="Add custom berry" />}
      />

      <Suspense fallback={<CatalogGridSkeleton />}>
        <BerryResults searchParams={searchParams} />
      </Suspense>
    </CatalogPage>
  );
}

async function BerryResults({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const result = await getBerryPage(query, parsePage(params.page));

  if (result.total === 0) {
    return (
      <CatalogResults>
        <CatalogEmpty>
          {query ? (
            <p>
              No berries match <span className="font-medium text-zinc-700 dark:text-zinc-300">“{query}”</span>.
            </p>
          ) : (
            <p>No berries yet.</p>
          )}
        </CatalogEmpty>
      </CatalogResults>
    );
  }

  return (
    <CatalogResults>
      <CatalogGrid>
        {result.items.map((berry) => (
          <li key={berry.id}>
            <CatalogCard
              href={`/${berry.name}`}
              name={berryDisplayName(berry.name)}
              imageUrl={berry.imageUrl}
              isCustom={berry.isCustom}
              pixelated
            />
          </li>
        ))}
      </CatalogGrid>
      <Pagination page={result.page} totalPages={result.totalPages} hrefForPage={(page) => buildPageHref(query, page)} />
    </CatalogResults>
  );
}

async function BerryCount({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const { total } = await getBerryPage(query, parsePage(params.page));

  return (
    <p>
      {total.toLocaleString("en-US")} {total === 1 ? "berry" : "berries"}
      {query && ` matching “${query}”`}
    </p>
  );
}
