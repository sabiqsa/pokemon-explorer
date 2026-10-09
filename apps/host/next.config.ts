import path from "node:path";
import type { NextConfig } from "next";

function zoneUrl(name: "POKEMON_URL" | "BERRIES_URL", devFallback: string): string {
  const value = process.env[name]?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (!value) {
    if (!isProduction) return devFallback;
    throw new Error(`${name} is not set. Set it to the deployed zone URL, e.g. https://my-zone.vercel.app`);
  }
  if (!/^https?:\/\//.test(value)) {
    throw new Error(`${name} must start with http:// or https:// (got "${value}").`);
  }
  return value.replace(/\/+$/, "");
}

const pokemonUrl = zoneUrl("POKEMON_URL", "http://localhost:3002");
const berriesUrl = zoneUrl("BERRIES_URL", "http://localhost:3001");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@pokedex/ui", "@pokedex/shared"],
  async rewrites() {
    return [
      { source: "/pokemon", destination: `${pokemonUrl}/pokemon` },
      { source: "/pokemon/:path*", destination: `${pokemonUrl}/pokemon/:path*` },
      { source: "/berries", destination: `${berriesUrl}/berries` },
      { source: "/berries/:path*", destination: `${berriesUrl}/berries/:path*` },
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
