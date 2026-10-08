import type { HTMLAttributes } from "react";

/** Small pill label. */
export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100 ${className}`}
      {...props}
    />
  );
}
