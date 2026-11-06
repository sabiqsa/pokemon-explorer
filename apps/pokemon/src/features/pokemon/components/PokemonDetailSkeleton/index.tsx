import { Skeleton } from "@pokedex/ui";

export function PokemonDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 sm:flex-row" aria-busy="true" aria-label="Loading pokemon">
      <Skeleton className="mx-auto size-60 rounded-full sm:mx-0" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-5 w-32 rounded" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-3 rounded" />
        ))}
      </div>
    </div>
  );
}
