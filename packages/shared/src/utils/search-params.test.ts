import { describe, expect, it } from "vitest";
import { buildPageHref, firstParam, parsePage } from "./search-params";

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

describe('buildPageHref', () => {
  it('drops page 1 and an empty query', () => {
    expect(buildPageHref('', 1)).toBe('/');
    expect(buildPageHref('', 2)).toBe('/?page=2');
  });

  it('keeps the search query on every page', () => {
    expect(buildPageHref('mega', 1)).toBe('/?q=mega');
    expect(buildPageHref('mega', 4)).toBe('/?q=mega&page=4');
  });

  it('encodes the query', () => {
    expect(buildPageHref('mr mime', 2)).toBe('/?q=mr+mime&page=2');
  });
});
