import { describe, expect, it } from "vitest";
import { paginate } from "./paginate";

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the requested page and totals", () => {
    expect(paginate(items, 2, 10)).toEqual({
      items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it("returns a short last page", () => {
    expect(paginate(items, 3, 10).items).toEqual([21, 22, 23, 24, 25]);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
    expect(paginate(items, -4, 10).page).toBe(1);
  });

  it("reports one empty page for no items", () => {
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 1 });
  });
});
