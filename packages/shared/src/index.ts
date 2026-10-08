// Server-safe entry: types and pure utils. Client hooks live in "@pokedex/shared/hooks".
export type { Paginated } from "./types/pagination";
export { paginate } from "./utils/paginate";
export { firstParam, parsePage } from "./utils/search-params";
