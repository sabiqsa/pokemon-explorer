import { GENERIC_SAVE_ERROR_MESSAGE, STORAGE_READ_ONLY_MESSAGE } from "@pokedex/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  isCustomStorageReadOnly: vi.fn(() => false),
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

const fsError = (code: string) => Object.assign(new Error(code), { code });

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
  service.isCustomStorageReadOnly.mockReturnValue(false);
});

describe("createPokemon", () => {
  it("rejects on the server when storage is read-only, without writing", async () => {
    service.isCustomStorageReadOnly.mockReturnValue(true);
    expect(await createPokemon({}, validForm())).toEqual({ formError: STORAGE_READ_ONLY_MESSAGE });
    expect(service.addCustomPokemon).not.toHaveBeenCalled();
  });

  it("shows the read-only message when the write fails with a filesystem error", async () => {
    service.addCustomPokemon.mockRejectedValue(fsError("EROFS"));
    expect(await createPokemon({}, validForm())).toMatchObject({ formError: STORAGE_READ_ONLY_MESSAGE });
  });

  it("keeps the generic message for other errors", async () => {
    service.addCustomPokemon.mockRejectedValue(new Error("boom"));
    expect(await createPokemon({}, validForm())).toMatchObject({ formError: GENERIC_SAVE_ERROR_MESSAGE });
  });
});

describe("deletePokemon", () => {
  it("rejects on the server when storage is read-only, without deleting", async () => {
    service.isCustomStorageReadOnly.mockReturnValue(true);
    expect(await deletePokemon("custom-abc")).toEqual({ error: STORAGE_READ_ONLY_MESSAGE });
    expect(service.deleteCustomPokemon).not.toHaveBeenCalled();
  });

  it("shows the read-only message when the delete fails with a filesystem error", async () => {
    service.deleteCustomPokemon.mockRejectedValue(fsError("EACCES"));
    expect(await deletePokemon("custom-abc")).toEqual({ error: STORAGE_READ_ONLY_MESSAGE });
  });

  it("keeps the generic message for other errors", async () => {
    service.deleteCustomPokemon.mockRejectedValue(new Error("boom"));
    expect(await deletePokemon("custom-abc")).toEqual({ error: GENERIC_SAVE_ERROR_MESSAGE });
  });
});
