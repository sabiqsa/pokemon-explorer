import { CUSTOM_LIMIT_MESSAGE, GENERIC_SAVE_ERROR_MESSAGE } from "@pokedex/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  isCustomPokemonFull: vi.fn(async () => false),
  addCustomPokemon: vi.fn(),
  deleteCustomPokemon: vi.fn(),
  getTypeNames: vi.fn(async () => ["electric"]),
  getTakenNames: vi.fn(async () => new Set<string>()),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/features/pokemon/data/services/pokemon-service", () => service);

const { createPokemon } = await import("./create-pokemon");
const { deletePokemon } = await import("./delete-pokemon");

function validForm() {
  const form = new FormData();
  form.set("name", "sparkymon");
  form.append("types", "electric");
  form.set("abilities", "static");
  for (const stat of ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]) form.set(stat, "50");
  return form;
}

beforeEach(() => {
  vi.clearAllMocks();
  service.isCustomPokemonFull.mockResolvedValue(false);
});

describe("createPokemon", () => {
  it("rejects when the custom entry limit is reached, without writing", async () => {
    service.isCustomPokemonFull.mockResolvedValue(true);
    expect(await createPokemon({}, validForm())).toEqual({ formError: CUSTOM_LIMIT_MESSAGE });
    expect(service.addCustomPokemon).not.toHaveBeenCalled();
  });

  it("shows a generic message when saving fails", async () => {
    service.addCustomPokemon.mockRejectedValue(new Error("boom"));
    expect(await createPokemon({}, validForm())).toMatchObject({ formError: GENERIC_SAVE_ERROR_MESSAGE });
  });
});

describe("deletePokemon", () => {
  it("shows a generic message when saving fails", async () => {
    service.deleteCustomPokemon.mockRejectedValue(new Error("boom"));
    expect(await deletePokemon("custom-abc")).toEqual({ error: GENERIC_SAVE_ERROR_MESSAGE });
  });
});
