import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BerryDetail } from "@/features/berries/types";
import { CUSTOM_ID_PREFIX } from "@/features/berries/config/constants";
import type { CustomBerryRepository, NewCustomBerry } from "./custom-berry-repository";

export function createJsonCustomBerryRepository(filePath: string): CustomBerryRepository {
  async function readAll(): Promise<BerryDetail[]> {
    try {
      return JSON.parse(await readFile(filePath, "utf8")) as BerryDetail[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async function writeAll(berries: BerryDetail[]): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(berries, null, 2) + "\n");
  }

  return {
    list: readAll,

    async create(input: NewCustomBerry) {
      const berry: BerryDetail = {
        ...input,
        id: `${CUSTOM_ID_PREFIX}${randomUUID()}`,
        imageUrl: null,
        isCustom: true,
        naturalGiftType: null,
        naturalGiftPower: null,
      };
      await writeAll([...(await readAll()), berry]);
      return berry;
    },

    async delete(id: string) {
      const all = await readAll();
      const remaining = all.filter((b) => b.id !== id);
      if (remaining.length === all.length) return false;
      await writeAll(remaining);
      return true;
    },
  };
}
