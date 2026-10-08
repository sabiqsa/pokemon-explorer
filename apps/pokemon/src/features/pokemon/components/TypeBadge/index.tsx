import { Badge } from "@pokedex/ui";

export function TypeBadge({ type }: { type: string }) {
  return <Badge className="capitalize">{type}</Badge>;
}
