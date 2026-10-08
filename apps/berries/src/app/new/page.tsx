import { BackLink } from "@pokedex/ui";
import { BerryForm } from "@/features/berries/components/BerryForm";
import { getFirmnessNames } from "@/features/berries/data/services/berry-service";

export default async function NewBerryPage() {
  const firmnesses = await getFirmnessNames();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <BackLink href="/">All berries</BackLink>
      <h1 className="text-3xl font-semibold">Add custom berry</h1>
      <BerryForm firmnesses={firmnesses} />
    </main>
  );
}
