import path from "node:path";
import { createJsonCustomBerryRepository } from "./json-custom-berry-repository";

export type { CustomBerryRepository, NewCustomBerry } from "./custom-berry-repository";

export const customBerryRepository = createJsonCustomBerryRepository(
  path.join(process.cwd(), "data", "custom-berries.json"),
);
