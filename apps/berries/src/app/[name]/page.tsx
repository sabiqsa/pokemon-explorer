import { BackLink, Badge, ConfirmDeleteButton, ImageWithFallback } from "@pokedex/ui";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BerryDetailSkeleton } from "@/features/berries/components/BerryDetailSkeleton";
import { deleteBerry } from "@/features/berries/data/actions/delete-berry";
import { FlavorBar } from "@/features/berries/components/FlavorBar";
import { getBerryDetail } from "@/features/berries/data/services/berry-service";
import { EMPTY_VALUE } from "@/features/berries/config/constants";
import { berryDisplayName, displayId, formatValue } from "@/features/berries/utils/helper";

export default function BerryDetailPage({ params }: PageProps<"/[name]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <BackLink href="/">All berries</BackLink>
      <Suspense fallback={<BerryDetailSkeleton />}>
        <BerryDetail params={params} />
      </Suspense>
    </main>
  );
}

async function BerryDetail({ params }: Pick<PageProps<"/[name]">, "params">) {
  const { name } = await params;
  const berry = await getBerryDetail(decodeURIComponent(name).toLowerCase());
  if (!berry) notFound();

  const facts = [
    { label: "Size", value: formatValue(berry.sizeMm, "mm") },
    { label: "Growth time", value: formatValue(berry.growthTimeHours, "h per stage") },
    { label: "Max harvest", value: formatValue(berry.maxHarvest) },
    { label: "Natural Gift power", value: formatValue(berry.naturalGiftPower) },
  ];

  return (
    <article className="flex flex-col gap-8 sm:flex-row">
      <div className="flex flex-col items-center gap-3 sm:w-48">
        <ImageWithFallback src={berry.imageUrl} alt={berryDisplayName(berry.name)} size={160} />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-sm text-zinc-500">{displayId(berry.id, berry.isCustom)}</span>
          <h1 className="text-3xl font-semibold">{berryDisplayName(berry.name)}</h1>
          <div className="flex gap-2">
            <Badge className="capitalize">Firmness: {berry.firmness?.replace("-", " ") ?? EMPTY_VALUE}</Badge>
            <Badge className="capitalize">Natural Gift: {berry.naturalGiftType ?? EMPTY_VALUE}</Badge>
          </div>
        </header>

        {berry.isCustom && (
          <ConfirmDeleteButton
            title={`Delete ${berryDisplayName(berry.name)}?`}
            description="This permanently removes it from your custom berries. You can’t undo this."
            action={deleteBerry.bind(null, berry.id)}
            redirectTo="/"
          />
        )}

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Effect</h2>
          <p className="text-zinc-700 dark:text-zinc-300">{berry.effect ?? EMPTY_VALUE}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Flavors</h2>
          {berry.flavors.length > 0 ? (
            berry.flavors.map((flavor) => <FlavorBar key={flavor.name} flavor={flavor} />)
          ) : (
            <p className="text-zinc-700 dark:text-zinc-300">{EMPTY_VALUE}</p>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Growing</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-zinc-600 dark:text-zinc-400">{fact.label}</dt>
                <dd className="font-medium tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
