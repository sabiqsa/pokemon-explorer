import { cleanup, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useLinkStatus: () => ({ pending: false }),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const { Pagination } = await import('./index');
const { buildPageHref } = await import('@pokedex/shared');

afterEach(cleanup);

function renderPagination(page: number, totalPages: number, query = '') {
  render(<Pagination page={page} totalPages={totalPages} hrefForPage={(p) => buildPageHref(query, p)} />);
  return within(screen.getByRole('navigation', { name: 'Pagination' }).querySelector('ul')!);
}

describe('Pagination', () => {
  it('shows ellipses between distant pages', () => {
    const list = renderPagination(46, 57);
    const items = Array.from(list.getAllByRole('listitem', { hidden: true }), (li) => li.textContent);
    expect(items).toEqual(['', '1', '…', '45', '46', '47', '…', '57', '']);
    expect(list.getAllByText('…').every((el) => el.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('marks only the current page with aria-current', () => {
    const list = renderPagination(4, 57);
    const current = list.getByText('4');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.tagName).toBe('SPAN');
    expect(list.getByText('5').closest('a')).not.toBeNull();
    expect(list.getAllByRole('link').some((link) => link.getAttribute('aria-current'))).toBe(false);
  });

  it('disables Previous on the first page and keeps Next as a link', () => {
    const list = renderPagination(1, 10);
    expect(list.getByLabelText('Previous page').tagName).toBe('SPAN');
    expect(list.getByLabelText('Previous page').getAttribute('aria-disabled')).toBe('true');
    expect(list.getByLabelText('Next page').tagName).toBe('A');
  });

  it('disables Next on the last page and keeps Previous as a link', () => {
    const list = renderPagination(10, 10);
    expect(list.getByLabelText('Next page').getAttribute('aria-disabled')).toBe('true');
    expect(list.getByLabelText('Previous page').tagName).toBe('A');
  });

  it('keeps the search query in every page link', () => {
    const list = renderPagination(2, 9, 'mega');
    const hrefs = list.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/?q=mega', '/?q=mega', '/?q=mega&page=3', '/?q=mega&page=9', '/?q=mega&page=3']);
  });

  it('renders nothing when there are no pages', () => {
    const { container } = render(<Pagination page={1} totalPages={0} hrefForPage={() => '/'} />);
    expect(container.innerHTML).toBe('');
  });
});
