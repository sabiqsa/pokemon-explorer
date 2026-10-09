import { NextResponse, type NextRequest } from "next/server";

const zones = {
  pokemon: process.env.POKEMON_URL?.trim().replace(/\/+$/, "") || "http://localhost:3002",
  berries: process.env.BERRIES_URL?.trim().replace(/\/+$/, "") || "http://localhost:3001",
};

export function proxy(request: NextRequest) {
  const zone = request.nextUrl.pathname.split("/")[1] as keyof typeof zones;
  const { pathname, search } = request.nextUrl;
  return NextResponse.rewrite(new URL(`${pathname}${search}`, zones[zone]));
}

export const config = {
  matcher: [
    {
      source: "/:zone(pokemon|berries)/:path*",
      has: [{ type: "header", key: "next-router-segment-prefetch" }],
    },
  ],
};
