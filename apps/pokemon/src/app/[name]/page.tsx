import { displayName } from "@pokedex/shared";
import { BackLink, ConfirmDeleteButton, ImageWithFallback } from "@pokedex/ui";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { displayId } from "@/features/pokemon/utils/helper";
import { deletePokemon } from "@/features/pokemon/data/actions/delete-pokemon";
import { PokemonDetailSkeleton } from "@/features/pokemon/components/PokemonDetailSkeleton";
import { StatBar } from "@/features/pokemon/components/StatBar";
import { TypeBadge } from "@/features/pokemon/components/TypeBadge";
import { getPokemonDetail } from "@/features/pokemon/data/services/pokemon-service";

export default function PokemonDetailPage({ params }: PageProps<"/[name]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <BackLink href="/">All pokemon</BackLink>
      <Suspense fallback={<PokemonDetailSkeleton />}>
        <PokemonDetail params={params} />
      </Suspense>
    </main>
  );
}

async function PokemonDetail({ params }: Pick<PageProps<"/[name]">, "params">) {
  const { name } = await params;
  const pokemon = await getPokemonDetail(decodeURIComponent(name).toLowerCase());
  if (!pokemon) notFound();

  return (
    <article className="flex flex-col gap-8 sm:flex-row">
      <div className="flex flex-col items-center gap-3 sm:w-64">
        <ImageWithFallback src={pokemon.imageUrl} alt={pokemon.name} size={240} />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-sm text-zinc-500">{displayId(pokemon.id, pokemon.isCustom)}</span>
          <h1 className="text-3xl font-semibold">{displayName(pokemon.name)}</h1>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </header>

        {pokemon.isCustom && (
          <ConfirmDeleteButton
            title={`Delete ${displayName(pokemon.name)}?`}
            description="This permanently removes it from your custom pokemon. You can’t undo this."
            action={deletePokemon.bind(null, pokemon.id)}
          />
        )}

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Abilities</h2>
          <ul className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <li key={ability} className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm dark:bg-zinc-800">
                {displayName(ability)}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Base stats</h2>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} stat={stat} />
          ))}
        </section>
      </div>
    </article>
  );
}
