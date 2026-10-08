import { Card } from "@pokedex/ui";
import Link from "next/link";
import type { PokemonSummary } from "@/features/pokemon/types";
import { displayId, displayName } from "@/features/pokemon/utils/helper";
import { PokemonImage } from "@/features/pokemon/components/PokemonImage";

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  return (
    <Link href={`/${pokemon.name}`} className="group block rounded-xl">
      <Card className="flex flex-col items-center gap-2 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
        <PokemonImage src={pokemon.imageUrl} name={pokemon.name} size={96} />
        <span className="text-xs text-zinc-500">{displayId(pokemon.id, pokemon.isCustom)}</span>
        <span className="text-center font-medium">{displayName(pokemon.name)}</span>
      </Card>
    </Link>
  );
}
