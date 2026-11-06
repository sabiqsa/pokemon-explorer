import type { InputHTMLAttributes } from 'react';

export function Input({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 aria-invalid:border-red-600 dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
      {...props}
    />
  );
}
