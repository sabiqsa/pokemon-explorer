import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import arrowIcon from "../Assets/arrow.png";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 self-start text-sm text-zinc-600 hover:underline dark:text-zinc-400"
    >
      <Image src={arrowIcon} alt="" width={14} height={14} className="opacity-70 dark:invert" />
      {children}
    </Link>
  );
}
