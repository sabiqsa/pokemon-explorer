import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/berries",
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@pokedex/ui", "@pokedex/shared"],
  turbopack: {
    root: path.join(__dirname, "../.."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
