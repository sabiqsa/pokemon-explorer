import { BackLink, StorageReadOnlyNotice } from "@pokedex/ui";
import { BerryForm } from "@/features/berries/components/BerryForm";
import { getFirmnessNames, isCustomStorageReadOnly } from "@/features/berries/data/services/berry-service";

export default async function NewBerryPage() {
  const firmnesses = await getFirmnessNames();
  const readOnly = isCustomStorageReadOnly();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <BackLink href="/">All berries</BackLink>
      <h1 className="text-3xl font-semibold">Add custom berry</h1>
      {readOnly && <StorageReadOnlyNotice />}
      <BerryForm firmnesses={firmnesses} readOnly={readOnly} />
    </main>
  );
}
