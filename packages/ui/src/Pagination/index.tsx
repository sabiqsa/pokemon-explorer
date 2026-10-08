import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Build the URL for a page, so callers keep their own query params (search, filters). */
  hrefForPage: (page: number) => string;
};

/** Previous / next links plus "Page X of Y". Renders nothing when everything fits on one page. */
export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkClass = "rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
  const disabledClass = "rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-600";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className={linkClass} rel="prev">
          Previous
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Previous
        </span>
      )}
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className={linkClass} rel="next">
          Next
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
}
