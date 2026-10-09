import { GENERIC_SAVE_ERROR_MESSAGE, STORAGE_READ_ONLY_MESSAGE } from "@pokedex/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  isCustomStorageReadOnly: vi.fn(() => false),
  addCustomBerry: vi.fn(),
  deleteCustomBerry: vi.fn(),
  getFirmnessNames: vi.fn(async () => ["soft"]),
  getTakenNames: vi.fn(async () => new Set<string>()),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/features/berries/data/services/berry-service", () => service);

const { createBerry } = await import("./create-berry");
const { deleteBerry } = await import("./delete-berry");

const fsError = (code: string) => Object.assign(new Error(code), { code });

function validForm() {
  const form = new FormData();
  form.set("name", "moonglow");
  form.set("firmness", "soft");
  for (const flavor of ["spicy", "dry", "sweet", "bitter", "sour"]) form.set(flavor, flavor === "sweet" ? "20" : "0");
  form.set("sizeMm", "40");
  form.set("growthTimeHours", "12");
  form.set("maxHarvest", "5");
  form.set("effect", "");
  return form;
}

beforeEach(() => {
  vi.clearAllMocks();
  service.isCustomStorageReadOnly.mockReturnValue(false);
});

describe("createBerry", () => {
  it("rejects on the server when storage is read-only, without writing", async () => {
    service.isCustomStorageReadOnly.mockReturnValue(true);
    expect(await createBerry({}, validForm())).toEqual({ formError: STORAGE_READ_ONLY_MESSAGE });
    expect(service.addCustomBerry).not.toHaveBeenCalled();
  });

  it("shows the read-only message when the write fails with a filesystem error", async () => {
    service.addCustomBerry.mockRejectedValue(fsError("EROFS"));
    expect(await createBerry({}, validForm())).toMatchObject({ formError: STORAGE_READ_ONLY_MESSAGE });
  });

  it("keeps the generic message for other errors", async () => {
    service.addCustomBerry.mockRejectedValue(new Error("boom"));
    expect(await createBerry({}, validForm())).toMatchObject({ formError: GENERIC_SAVE_ERROR_MESSAGE });
  });
});

describe("deleteBerry", () => {
  it("rejects on the server when storage is read-only, without deleting", async () => {
    service.isCustomStorageReadOnly.mockReturnValue(true);
    expect(await deleteBerry("custom-abc")).toEqual({ error: STORAGE_READ_ONLY_MESSAGE });
    expect(service.deleteCustomBerry).not.toHaveBeenCalled();
  });

  it("shows the read-only message when the delete fails with a filesystem error", async () => {
    service.deleteCustomBerry.mockRejectedValue(fsError("EACCES"));
    expect(await deleteBerry("custom-abc")).toEqual({ error: STORAGE_READ_ONLY_MESSAGE });
  });

  it("keeps the generic message for other errors", async () => {
    service.deleteCustomBerry.mockRejectedValue(new Error("boom"));
    expect(await deleteBerry("custom-abc")).toEqual({ error: GENERIC_SAVE_ERROR_MESSAGE });
  });
});
