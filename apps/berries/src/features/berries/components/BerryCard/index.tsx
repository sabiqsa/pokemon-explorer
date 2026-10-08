import { Badge, Card, ImageWithFallback } from "@pokedex/ui";
import Link from "next/link";
import type { BerrySummary } from "@/features/berries/types";
import { berryDisplayName } from "@/features/berries/utils/helper";

export function BerryCard({ berry }: { berry: BerrySummary }) {
  const name = berryDisplayName(berry.name);

  return (
    <Link href={`/${berry.name}`} className="group block h-full rounded-xl">
      <Card className="flex h-full flex-col items-center gap-2 transition-[border-color,box-shadow] group-hover:border-zinc-400 group-hover:shadow-md fit-screen:gap-1 fit-screen:p-2 dark:group-hover:border-zinc-600">
        <ImageWithFallback
          src={berry.imageUrl}
          alt={name}
          fill
          sizes="96px"
          className="h-16 w-full fit-screen:h-auto fit-screen:min-h-0 fit-screen:flex-1 [&_img]:[image-rendering:pixelated]"
        />
        {berry.isCustom && <Badge className="shrink-0">Custom</Badge>}
        <span className="w-full shrink-0 truncate text-center font-medium" title={name}>
          {name}
        </span>
      </Card>
    </Link>
  );
}
