import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${className}`} aria-hidden="true" {...props} />;
}
