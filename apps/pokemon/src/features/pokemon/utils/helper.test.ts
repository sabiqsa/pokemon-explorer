import { describe, expect, it } from "vitest";
import { displayId, displayName, toSlug } from "./helper";

describe("toSlug", () => {
  it("lowercases, trims and hyphenates spaces", () => {
    expect(toSlug("  Mr   Mime ")).toBe("mr-mime");
  });
});

describe("displayName", () => {
  it("title-cases each hyphenated part", () => {
    expect(displayName("mr-mime")).toBe("Mr Mime");
    expect(displayName("pikachu")).toBe("Pikachu");
  });
});

describe("displayId", () => {
  it("zero-pads PokéAPI IDs to four digits without truncating longer ones", () => {
    expect(displayId("25", false)).toBe("#0025");
    expect(displayId("10326", false)).toBe("#10326");
  });

  it("labels custom pokemon instead of showing their ID", () => {
    expect(displayId("custom-abc", true)).toBe("Custom");
  });
});
