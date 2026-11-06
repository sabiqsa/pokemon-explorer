import { CatalogGridSkeleton, CatalogHeader, CatalogPage, Skeleton } from "@pokedex/ui";

export default function Loading() {
  return (
    <CatalogPage>
      <CatalogHeader
        title={<Skeleton className="h-8 w-52 rounded" />}
        subtitle={<Skeleton className="mt-1 h-4 w-24 rounded" />}
        search={<Skeleton className="h-10.5 rounded-lg" />}
        action={<Skeleton className="h-8 w-16 rounded-md sm:h-10 sm:w-40" />}
      />
      <CatalogGridSkeleton />
    </CatalogPage>
  );
}
