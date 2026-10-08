import { Card, Skeleton } from "@pokedex/ui";

export function PokemonGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading pokemon">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </Card>
      ))}
    </div>
  );
}
