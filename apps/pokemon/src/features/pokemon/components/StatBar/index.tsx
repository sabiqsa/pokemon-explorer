import type { PokemonStat } from "@/features/pokemon/types";
import { STAT_LABELS, STAT_MAX } from "@/features/pokemon/config/constants";

export function StatBar({ stat }: { stat: PokemonStat }) {
  const percent = Math.min(100, (stat.value / STAT_MAX) * 100);

  return (
    <div className="grid grid-cols-[5rem_2.5rem_1fr] items-center gap-3 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{STAT_LABELS[stat.name]}</span>
      <span className="text-right font-medium tabular-nums">{stat.value}</span>
      <div
        className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="meter"
        aria-label={STAT_LABELS[stat.name]}
        aria-valuenow={stat.value}
        aria-valuemin={0}
        aria-valuemax={STAT_MAX}
      >
        <div className="h-2 rounded-full bg-red-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
