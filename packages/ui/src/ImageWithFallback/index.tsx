'use client';

import Image from 'next/image';
import { useState } from 'react';

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
} & (
  | { size: number; fill?: never; sizes?: never; className?: never }
  | { fill: true; sizes: string; className?: string; size?: never }
);

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, alt } = props;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const missing = !src || failedSrc === src;

  if (props.fill) {
    return (
      <div className={`relative flex items-center justify-center ${props.className ?? ''}`}>
        {missing ? (
          <div
            className="flex aspect-square h-full max-h-full max-w-full items-center justify-center rounded-full bg-zinc-100 text-3xl font-bold text-zinc-400 dark:bg-zinc-800"
            role="img"
            aria-label={`${alt} (no image)`}
          >
            ?
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={props.sizes}
            className="object-contain"
            onError={() => setFailedSrc(src)}
          />
        )}
      </div>
    );
  }

  if (missing) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold text-zinc-400 dark:bg-zinc-800"
        style={{ width: props.size, height: props.size }}
        role="img"
        aria-label={`${alt} (no image)`}
      >
        ?
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={props.size}
      height={props.size}
      className="object-contain"
      onError={() => setFailedSrc(src)}
    />
  );
}
