import { CatalogGridSkeleton, CatalogHeader, CatalogPage, Skeleton } from "@pokedex/ui";

export default function Loading() {
  return (
    <CatalogPage>
      <CatalogHeader
        title={<Skeleton className="h-9 w-56 rounded" />}
        search={<Skeleton className="h-10.5 rounded-lg" />}
        action={<Skeleton className="h-10 w-28 rounded-md" />}
      />
      <CatalogGridSkeleton />
    </CatalogPage>
  );
}
