"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Artwork, or a "?" placeholder when there is none: custom pokemon have no image,
 * and some alternate forms (e.g. ID 10264) have no official artwork, so the URL 404s.
 */
export function PokemonImage({ src, name, size }: { src: string | null; name: string; size: number }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold text-zinc-400 dark:bg-zinc-800"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${name} (no image)`}
      >
        ?
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className="object-contain"
      onError={() => setFailedSrc(src)}
    />
  );
}
