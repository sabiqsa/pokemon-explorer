import { ELLIPSIS, getPageItems } from '@pokedex/shared';
import Image from 'next/image';
import Link from 'next/link';
import arrowIcon from '../Assets/arrow.png';
import { LinkPending } from '../LinkPending';

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

const boxClass = 'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm';
const linkClass = `${boxClass} border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800`;
const currentClass = `${boxClass} border-red-600 bg-red-600 font-medium text-white`;
const disabledClass = `${boxClass} border-zinc-200 opacity-40 dark:border-zinc-800`;

function Arrow({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <Image
      src={arrowIcon}
      alt=""
      width={16}
      height={16}
      className={`dark:invert ${direction === 'next' ? 'rotate-180' : ''}`}
    />
  );
}

function StepLink({ direction, href }: { direction: 'prev' | 'next'; href: string | null }) {
  const label = direction === 'prev' ? 'Previous page' : 'Next page';
  if (href === null) {
    return (
      <span className={disabledClass} aria-disabled="true" aria-label={label}>
        <Arrow direction={direction} />
      </span>
    );
  }
  return (
    <Link href={href} className={linkClass} rel={direction} aria-label={label}>
      <LinkPending>
        <Arrow direction={direction} />
      </LinkPending>
    </Link>
  );
}

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  const items = getPageItems(page, totalPages);
  if (items.length === 0) return null;

  const prevLink = <StepLink direction="prev" href={page > 1 ? hrefForPage(page - 1) : null} />;
  const nextLink = <StepLink direction="next" href={page < totalPages ? hrefForPage(page + 1) : null} />;

  return (
    <nav
      aria-label="Pagination"
      className="sticky bottom-0 z-10 -mx-4 flex fit-screen:mt-auto shrink-0 justify-center border-t border-zinc-200 bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 dark:border-zinc-800"
    >
      <div className="flex items-center gap-3 sm:hidden">
        {prevLink}
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Page {page} of {totalPages}
        </span>
        {nextLink}
      </div>

      <ul className="hidden items-center gap-1.5 sm:flex">
        <li>{prevLink}</li>
        {items.map((item, i) =>
          item === ELLIPSIS ? (
            <li key={`ellipsis-${i}`} aria-hidden="true" className="px-1 text-zinc-500">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className={currentClass} aria-current="page" aria-label={`Page ${item}`}>
                  {item}
                </span>
              ) : (
                <Link href={hrefForPage(item)} className={linkClass} aria-label={`Page ${item}`}>
                  <LinkPending>{item}</LinkPending>
                </Link>
              )}
            </li>
          ),
        )}
        <li>{nextLink}</li>
      </ul>
    </nav>
  );
}
