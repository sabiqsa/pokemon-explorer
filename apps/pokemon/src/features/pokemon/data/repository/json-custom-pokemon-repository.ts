import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PokemonDetail } from "@/features/pokemon/types";
import { CUSTOM_ID_PREFIX } from "@/features/pokemon/config/constants";
import type { CustomPokemonRepository, NewCustomPokemon } from "./custom-pokemon-repository";

/** Stores custom pokemon in one JSON file. Fine for local dev; not safe for concurrent writers. */
export function createJsonCustomPokemonRepository(filePath: string): CustomPokemonRepository {
  async function readAll(): Promise<PokemonDetail[]> {
    try {
      return JSON.parse(await readFile(filePath, "utf8")) as PokemonDetail[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async function writeAll(pokemon: PokemonDetail[]): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(pokemon, null, 2) + "\n");
  }

  return {
    list: readAll,

    async create(input: NewCustomPokemon) {
      const pokemon: PokemonDetail = {
        ...input,
        id: `${CUSTOM_ID_PREFIX}${randomUUID()}`,
        imageUrl: null,
        isCustom: true,
      };
      await writeAll([...(await readAll()), pokemon]);
      return pokemon;
    },

    async delete(id: string) {
      const all = await readAll();
      const remaining = all.filter((p) => p.id !== id);
      if (remaining.length === all.length) return false;
      await writeAll(remaining);
      return true;
    },
  };
}
