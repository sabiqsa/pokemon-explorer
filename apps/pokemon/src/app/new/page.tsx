import type { Metadata } from "next";
import { BackLink, StorageReadOnlyNotice } from "@pokedex/ui";
import { PokemonForm } from "@/features/pokemon/components/PokemonForm";
import { getTypeNames, isCustomStorageReadOnly } from "@/features/pokemon/data/services/pokemon-service";

export const metadata: Metadata = { title: "Add custom Pokémon" };

export default async function NewPokemonPage() {
  const types = await getTypeNames();
  const readOnly = isCustomStorageReadOnly();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <BackLink href="/">All pokemon</BackLink>
      <h1 className="text-3xl font-semibold">Add custom pokemon</h1>
      {readOnly && <StorageReadOnlyNotice />}
      <PokemonForm types={types} readOnly={readOnly} />
    </main>
  );
}
