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

const placeholderClass = 'rounded-full bg-zinc-100 dark:bg-zinc-800';

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, alt } = props;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const missing = !src || failedSrc === src;
  const loading = !missing && loadedSrc !== src;

  const markLoaded = () => setLoadedSrc(src);
  const markLoadedIfCached = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src);
  };
  const imageClass = `object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`;

  if (props.fill) {
    return (
      <div className={`relative flex items-center justify-center ${props.className ?? ''}`}>
        {missing ? (
          <div
            className={`flex aspect-square h-full max-h-full max-w-full items-center justify-center text-3xl font-bold text-zinc-400 ${placeholderClass}`}
            role="img"
            aria-label={`${alt} (no image)`}
          >
            ?
          </div>
        ) : (
          <>
            {loading && (
              <div aria-hidden="true" className={`absolute aspect-square h-3/4 max-w-3/4 animate-pulse ${placeholderClass}`} />
            )}
            <Image
              ref={markLoadedIfCached}
              src={src}
              alt={alt}
              fill
              sizes={props.sizes}
              className={imageClass}
              onLoad={markLoaded}
              onError={() => setFailedSrc(src)}
            />
          </>
        )}
      </div>
    );
  }

  if (missing) {
    return (
      <div
        className={`flex items-center justify-center text-4xl font-bold text-zinc-400 ${placeholderClass}`}
        style={{ width: props.size, height: props.size }}
        role="img"
        aria-label={`${alt} (no image)`}
      >
        ?
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: props.size, height: props.size }}>
      {loading && <div aria-hidden="true" className={`absolute inset-0 animate-pulse ${placeholderClass}`} />}
      <Image
        ref={markLoadedIfCached}
        src={src}
        alt={alt}
        width={props.size}
        height={props.size}
        className={imageClass}
        onLoad={markLoaded}
        onError={() => setFailedSrc(src)}
      />
    </div>
  );
}
