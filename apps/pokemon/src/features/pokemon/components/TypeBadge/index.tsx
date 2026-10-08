import { Badge } from "@pokedex/ui";

/** Pokemon type label, built on the shared Badge. */
export function TypeBadge({ type }: { type: string }) {
  return <Badge className="capitalize">{type}</Badge>;
}
