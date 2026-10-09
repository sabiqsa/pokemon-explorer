import path from "node:path";
import type { NextConfig } from "next";

function serverActionOrigins(): string[] {
  const origins = ["localhost:3000"];
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL?.trim();
  if (!hostUrl) return origins;

  try {
    origins.push(new URL(hostUrl).host);
  } catch {
    throw new Error(`NEXT_PUBLIC_HOST_URL must be a full URL such as https://my-app.vercel.app (got "${hostUrl}").`);
  }
  return origins;
}

const nextConfig: NextConfig = {
  basePath: "/pokemon",
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@pokedex/ui", "@pokedex/shared"],
  experimental: {
    serverActions: {
      allowedOrigins: serverActionOrigins(),
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
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
