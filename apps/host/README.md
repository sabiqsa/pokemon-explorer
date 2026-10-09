# host

Entry point of Pokémon Explorer: renders the home page and forwards `/pokemon` and `/berries` to their zones via rewrites.

- **Local URL:** http://localhost:3000 (no basePath)
- **Env** (`.env.local`, see `.env.example`):
  - `POKEMON_URL` – pokemon zone origin, e.g. `http://localhost:3002`
  - `BERRIES_URL` – berries zone origin, e.g. `http://localhost:3001`
  - `NEXT_PUBLIC_HOST_URL` – optional, public URL of this app (empty locally)
- **Run:** `yarn workspace host dev` (start both zones too, or the rewrites have nothing to reach)
- **Test:** no unit tests in this app; shared code is tested in `packages/*`

See the [root README](../../README.md) for setup and architecture.
