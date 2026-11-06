import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock("@/features/berries/data/repository", () => ({
  getCustomBerryRepository: () => ({ list: vi.fn(async () => []), create: vi.fn(), delete: vi.fn() }),
}));

const { getBerryDetail, getBerryPage } = await import("./berry-service");

const BERRY_COUNT = 68;
const berryList = {
  count: BERRY_COUNT,
  results: Array.from({ length: BERRY_COUNT }, (_, i) => ({
    name: i === 0 ? "cheri" : `berry${i + 1}`,
    url: `https://pokeapi.co/api/v2/berry/${i + 1}/`,
  })),
};

const cheri = {
  id: 1,
  name: "cheri",
  growth_time: 3,
  max_harvest: 5,
  natural_gift_power: 60,
  size: 20,
  firmness: { name: "soft", url: "" },
  flavors: [],
  item: { name: "cheri-berry", url: "https://pokeapi.co/api/v2/item/126/" },
  natural_gift_type: { name: "fire", url: "" },
};

const cheriItem = {
  name: "cheri-berry",
  effect_entries: [{ short_effect: "Cures paralysis.", effect: "", language: { name: "en", url: "" } }],
};

const fetchMock = vi.fn(async (url: string) => {
  if (url.includes("/berry?limit=")) return Response.json(berryList);
  if (url.endsWith("/berry/cheri")) return Response.json(cheri);
  if (url === cheri.item.url) return Response.json(cheriItem);
  return new Response(null, { status: 404 });
});

const pokeApiCalls = () => fetchMock.mock.calls.map(([url]) => url);

beforeEach(() => {
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getBerryPage", () => {
  it("builds a full page of cards from one list fetch, with no per-berry fetch", async () => {
    const page = await getBerryPage("", 1);

    expect(page.items).toHaveLength(12);
    expect(page.total).toBe(BERRY_COUNT);
    expect(pokeApiCalls()).toEqual(["https://pokeapi.co/api/v2/berry?limit=1000"]);
  });

  it("still makes a single fetch when searching or paging", async () => {
    await getBerryPage("berry", 3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("getBerryDetail", () => {
  it("fetches the berry, then its item by the URL from the berry", async () => {
    const detail = await getBerryDetail("cheri");

    expect(detail?.effect).toBe("Cures paralysis.");
    expect(pokeApiCalls()).toEqual(["https://pokeapi.co/api/v2/berry/cheri", "https://pokeapi.co/api/v2/item/126/"]);
  });

  it("never calls PokéAPI for a name that isn't a valid slug", async () => {
    expect(await getBerryDetail("../item")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
