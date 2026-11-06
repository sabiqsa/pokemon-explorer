import { describe, expect, it } from "vitest";
import { displayId } from "./helper";

describe("displayId", () => {
  it("zero-pads PokéAPI IDs to four digits without truncating longer ones", () => {
    expect(displayId("25", false)).toBe("#0025");
    expect(displayId("10326", false)).toBe("#10326");
  });

  it("labels custom pokemon instead of showing their ID", () => {
    expect(displayId("custom-abc", true)).toBe("Custom");
  });
});
