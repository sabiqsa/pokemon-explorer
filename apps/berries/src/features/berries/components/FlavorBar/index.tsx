import type { BerryFlavor } from "@/features/berries/types";
import { FLAVOR_MAX } from "@/features/berries/config/constants";

export function FlavorBar({ flavor }: { flavor: BerryFlavor }) {
  const percent = Math.min(100, (flavor.potency / FLAVOR_MAX) * 100);

  return (
    <div className="grid grid-cols-[5rem_2.5rem_1fr] items-center gap-3 text-sm">
      <span className="capitalize text-zinc-600 dark:text-zinc-400">{flavor.name}</span>
      <span className="text-right font-medium tabular-nums">{flavor.potency}</span>
      <div
        className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="meter"
        aria-label={flavor.name}
        aria-valuenow={flavor.potency}
        aria-valuemin={0}
        aria-valuemax={FLAVOR_MAX}
      >
        <div className="h-2 rounded-full bg-red-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
