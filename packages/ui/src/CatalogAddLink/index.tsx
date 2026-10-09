"use client";

import Link from "next/link";
import { rememberListSearch } from "../list-return";

export function CatalogAddLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={rememberListSearch}
      aria-label={label}
      className="block rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 sm:px-4 sm:py-2 sm:text-base"
    >
      <span aria-hidden="true" className="sm:hidden">
        + Add
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
