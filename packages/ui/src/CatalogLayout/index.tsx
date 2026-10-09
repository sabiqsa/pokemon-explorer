import { PAGE_SIZE } from "@pokedex/shared";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "../Card";
import { Skeleton } from "../Skeleton";

export function CatalogPage({ children }: { children: ReactNode }) {
  return (
    <main
      data-fit-screen
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:gap-6 sm:py-10 fit-screen:min-h-0 fit-screen:gap-3 fit-screen:py-4"
    >
      {children}
    </main>
  );
}

type CatalogHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  search: ReactNode;
  action: ReactNode;
};

export function CatalogHeader({ title, subtitle, search, action }: CatalogHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 fit-screen:flex-nowrap">
      <div className="mr-auto min-w-0 fit-screen:mr-0 fit-screen:shrink-0">
        <h1 className="text-2xl font-semibold sm:text-3xl fit-screen:text-2xl">{title}</h1>
        {subtitle && <div className="mt-0.5 text-sm text-zinc-500">{subtitle}</div>}
      </div>
      <div className="order-last w-full fit-screen:order-none fit-screen:flex-1">{search}</div>
      <div className="shrink-0">{action}</div>
    </header>
  );
}

export function CatalogAddLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      prefetch={false}
      href={href}
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

export function CatalogResults({ children, busy }: { children: ReactNode; busy?: boolean }) {
  return (
    <div
      aria-busy={busy || undefined}
      className="flex flex-1 flex-col gap-6 fit-screen:min-h-0 fit-screen:gap-3"
    >
      {children}
    </div>
  );
}

export function CatalogGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 fit-screen:min-h-0 fit-screen:flex-1 fit-screen:grid-cols-4 fit-screen:grid-rows-3 fit-screen:gap-3 fit-screen:*:min-h-0">
      {children}
    </ul>
  );
}

export function CatalogEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center text-zinc-500 fit-screen:min-h-0 fit-screen:py-0">
      {children}
    </div>
  );
}


export function CatalogGridSkeleton() {
  return (
    <CatalogResults busy>
      <CatalogGrid>
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <li key={i}>
            <Card className="flex h-full flex-col items-center gap-2 fit-screen:gap-1 fit-screen:p-2">
              <Skeleton className="size-24 rounded-full fit-screen:size-auto fit-screen:aspect-square fit-screen:min-h-0 fit-screen:flex-1" />
              <Skeleton className="h-3 w-10 shrink-0 rounded" />
              <Skeleton className="h-4 w-20 shrink-0 rounded" />
            </Card>
          </li>
        ))}
      </CatalogGrid>
    </CatalogResults>
  );
}
