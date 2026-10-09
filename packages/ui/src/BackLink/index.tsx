"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import arrowIcon from "../Assets/arrow.png";
import { readListSearch } from "../list-return";

const subscribe = () => () => {};

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  const search = useSyncExternalStore(subscribe, readListSearch, () => "");

  return (
    <Link
      href={`${href}${search}`}
      className="inline-flex items-center gap-1.5 self-start text-sm text-zinc-600 hover:underline dark:text-zinc-400"
    >
      <Image src={arrowIcon} alt="" width={14} height={14} className="opacity-70 dark:invert" />
      {children}
    </Link>
  );
}
