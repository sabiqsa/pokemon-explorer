import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@pokedex/ui", "@pokedex/shared"],
  async rewrites() {
    return [
      { source: "/pokemon", destination: `${process.env.POKEMON_URL}/pokemon` },
      { source: "/pokemon/:path*", destination: `${process.env.POKEMON_URL}/pokemon/:path*` },
      { source: "/berries", destination: `${process.env.BERRIES_URL}/berries` },
      { source: "/berries/:path*", destination: `${process.env.BERRIES_URL}/berries/:path*` },
    ];
  },
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
