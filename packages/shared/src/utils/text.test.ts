import { describe, expect, it } from "vitest";
import { displayName, toSlug } from "./text";

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
