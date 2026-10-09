# berries

Berries zone: list, search and pagination over PokéAPI, detail pages with flavors and effect, and add/delete custom berries.

- **Local URL:** http://localhost:3001/berries (basePath `/berries`; through the host: http://localhost:3000/berries)
- **Env** (`.env.local`, see `.env.example`):
  - `NEXT_PUBLIC_HOST_URL` – optional, host URL for navbar links (empty locally)
- **Run:** `yarn workspace berries dev`
- **Test:** `yarn vitest run --project berries` (from the repo root)
- **Data:** custom berries are saved to `data/custom-berries.json` (git-ignored)

See the [root README](../../README.md) for setup and architecture.
