import { CUSTOM_LIMIT_MESSAGE, GENERIC_SAVE_ERROR_MESSAGE } from "@pokedex/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  isCustomBerriesFull: vi.fn(async () => false),
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
  service.isCustomBerriesFull.mockResolvedValue(false);
});

describe("createBerry", () => {
  it("rejects when the custom entry limit is reached, without writing", async () => {
    service.isCustomBerriesFull.mockResolvedValue(true);
    expect(await createBerry({}, validForm())).toEqual({ formError: CUSTOM_LIMIT_MESSAGE });
    expect(service.addCustomBerry).not.toHaveBeenCalled();
  });

  it("shows a generic message when saving fails", async () => {
    service.addCustomBerry.mockRejectedValue(new Error("boom"));
    expect(await createBerry({}, validForm())).toMatchObject({ formError: GENERIC_SAVE_ERROR_MESSAGE });
  });
});

describe("deleteBerry", () => {
  it("shows a generic message when saving fails", async () => {
    service.deleteCustomBerry.mockRejectedValue(new Error("boom"));
    expect(await deleteBerry("custom-abc")).toEqual({ error: GENERIC_SAVE_ERROR_MESSAGE });
  });
});
