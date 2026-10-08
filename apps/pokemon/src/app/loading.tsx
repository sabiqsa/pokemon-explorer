import { Skeleton } from "@pokedex/ui";
import { PokemonGridSkeleton } from "@/features/pokemon/components/PokemonGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <Skeleton className="h-9 w-40 rounded" />
      <PokemonGridSkeleton />
    </main>
  );
}
