import { describe, expect, it } from "vitest";
import { firstParam, parsePage } from "./search-params";

describe("firstParam", () => {
  it("takes the first value of a repeated param", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam("a")).toBe("a");
    expect(firstParam(undefined)).toBeUndefined();
  });
});

describe("parsePage", () => {
  it("parses positive integers", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("falls back to 1 for missing or invalid input", () => {
    for (const value of [undefined, "", "abc", "0", "-2"]) {
      expect(parsePage(value)).toBe(1);
    }
  });
});
