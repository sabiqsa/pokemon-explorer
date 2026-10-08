import type { HTMLAttributes } from "react";

/**
 * Pulsing placeholder block. The caller sets size and shape via className
 * (e.g. "h-4 w-20 rounded", "size-24 rounded-full"). No default radius, so callers never fight it.
 */
export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${className}`} aria-hidden="true" {...props} />;
}
