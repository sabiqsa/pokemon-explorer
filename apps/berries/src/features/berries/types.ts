import type { CatalogSummary } from "@pokedex/shared";
import type { FLAVOR_NAMES } from "@/features/berries/config/constants";

export type FlavorName = (typeof FLAVOR_NAMES)[number];

export type BerryFlavor = {
  name: FlavorName;
  potency: number;
};

export type BerrySummary = CatalogSummary;

export type BerryDetail = BerrySummary & {
  firmness: string | null;
  flavors: BerryFlavor[];
  sizeMm: number | null;
  growthTimeHours: number | null;
  maxHarvest: number | null;
  naturalGiftType: string | null;
  naturalGiftPower: number | null;
  effect: string | null;
};
