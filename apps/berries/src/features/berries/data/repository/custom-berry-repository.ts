import type { BerryDetail } from "@/features/berries/types";

export type NewCustomBerry = Omit<
  BerryDetail,
  "id" | "imageUrl" | "isCustom" | "naturalGiftType" | "naturalGiftPower"
>;

export interface CustomBerryRepository {
  list(): Promise<BerryDetail[]>;
  create(input: NewCustomBerry): Promise<BerryDetail>;
  delete(id: string): Promise<boolean>;
}
