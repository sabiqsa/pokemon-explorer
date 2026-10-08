import { displayName } from "@pokedex/shared";
import { Badge, Card, ImageWithFallback } from "@pokedex/ui";
import Link from "next/link";
import type { PokemonSummary } from "@/features/pokemon/types";
import { displayId } from "@/features/pokemon/utils/helper";

export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  const name = displayName(pokemon.name);

  return (
    <Link href={`/${pokemon.name}`} className="group block h-full rounded-xl">
      <Card className="flex h-full flex-col items-center gap-2 transition-[border-color,box-shadow] group-hover:border-zinc-400 group-hover:shadow-md fit-screen:gap-1 fit-screen:p-2 dark:group-hover:border-zinc-600">
        <ImageWithFallback
          src={pokemon.imageUrl}
          alt={name}
          fill
          sizes="160px"
          className="h-24 w-full fit-screen:h-auto fit-screen:min-h-0 fit-screen:flex-1"
        />
        {pokemon.isCustom ? (
          <Badge className="shrink-0">Custom</Badge>
        ) : (
          <span className="shrink-0 text-xs text-zinc-500">{displayId(pokemon.id, false)}</span>
        )}
        <span className="w-full shrink-0 truncate text-center font-medium" title={name}>
          {name}
        </span>
      </Card>
    </Link>
  );
}
