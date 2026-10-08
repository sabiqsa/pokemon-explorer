import { buildPageHref, firstParam, parsePage } from "@pokedex/shared";
import {
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
import { BerryCard } from "@/features/berries/components/BerryCard";
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
        action={
          <Link href="/new" className="block rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
            Add custom
          </Link>
        }
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
      <CatalogCount>
        {result.total.toLocaleString("en-US")} {result.total === 1 ? "berry" : "berries"}
          {query && ` matching “${query}”`}
      </CatalogCount>
      <CatalogGrid>
        {result.items.map((berry) => (
          <li key={berry.id}>
            <BerryCard berry={berry} />
          </li>
        ))}
      </CatalogGrid>
      <Pagination page={result.page} totalPages={result.totalPages} hrefForPage={(page) => buildPageHref(query, page)} />
    </CatalogResults>
  );
}
