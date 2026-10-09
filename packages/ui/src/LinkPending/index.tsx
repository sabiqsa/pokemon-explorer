'use client';

import { useLinkStatus } from 'next/link';
import type { ReactNode } from 'react';

export function LinkPending({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span aria-busy={pending || undefined} className={`inline-flex ${pending ? 'animate-pulse opacity-50' : ''}`}>
      {children}
    </span>
  );
}
