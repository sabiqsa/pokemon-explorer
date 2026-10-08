import { PokemonDetailSkeleton } from "@/features/pokemon/components/PokemonDetailSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <PokemonDetailSkeleton />
    </main>
  );
}
