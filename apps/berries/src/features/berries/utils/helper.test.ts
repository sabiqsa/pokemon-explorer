import { describe, expect, it } from "vitest";
import { berryDisplayName, displayId, formatValue } from "./helper";

describe("berryDisplayName", () => {
  it("title-cases the name and adds 'Berry'", () => {
    expect(berryDisplayName("cheri")).toBe("Cheri Berry");
    expect(berryDisplayName("roseli")).toBe("Roseli Berry");
  });
});

describe("displayId", () => {
  it("zero-pads to two digits and labels custom berries", () => {
    expect(displayId("1", false)).toBe("#01");
    expect(displayId("64", false)).toBe("#64");
    expect(displayId("custom-abc", true)).toBe("Custom");
  });
});

describe("formatValue", () => {
  it("shows 0 and null as a dash (one rule for missing PokéAPI data)", () => {
    expect(formatValue(0, "mm")).toBe("—");
    expect(formatValue(null)).toBe("—");
  });

  it("shows other numbers with an optional unit", () => {
    expect(formatValue(20, "mm")).toBe("20 mm");
    expect(formatValue(5)).toBe("5");
  });
});
