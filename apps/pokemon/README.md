# pokemon

Pokémon zone: list, search and pagination over PokéAPI, detail pages, and add/delete custom pokémon.

- **Local URL:** http://localhost:3002/pokemon (basePath `/pokemon`; through the host: http://localhost:3000/pokemon)
- **Env** (`.env.local`, see `.env.example`):
  - `NEXT_PUBLIC_HOST_URL` – optional, host URL for navbar links (empty locally)
- **Run:** `yarn workspace pokemon dev`
- **Test:** `yarn vitest run --project pokemon` (from the repo root)
- **Data:** custom pokémon are saved to `data/custom-pokemon.json` (git-ignored)

See the [root README](../../README.md) for setup and architecture.
