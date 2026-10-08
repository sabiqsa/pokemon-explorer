import { describe, expect, it } from 'vitest';
import { ELLIPSIS, getPageItems, type PageItem } from './page-items';

const render = (items: PageItem[]) => items.map((item) => (item === ELLIPSIS ? '…' : String(item))).join(' ');

describe('getPageItems', () => {
  it.each([
    [1, 57, '1 2 3 … 57'],
    [2, 57, '1 2 3 … 57'],
    [4, 57, '1 2 3 4 5 … 57'],
    [5, 57, '1 … 4 5 6 … 57'],
    [46, 57, '1 … 45 46 47 … 57'],
    [54, 57, '1 … 53 54 55 56 57'],
    [57, 57, '1 … 55 56 57'],
  ])('(%i, %i) → %s', (page, totalPages, expected) => {
    expect(render(getPageItems(page, totalPages))).toBe(expected);
  });

  it('shows every page without ellipsis up to 7 pages', () => {
    expect(render(getPageItems(3, 5))).toBe('1 2 3 4 5');
    expect(render(getPageItems(1, 7))).toBe('1 2 3 4 5 6 7');
    expect(render(getPageItems(7, 7))).toBe('1 2 3 4 5 6 7');
  });

  it('starts using ellipsis at 8 pages', () => {
    expect(render(getPageItems(1, 8))).toBe('1 2 3 … 8');
  });

  it('fills a one-page gap with the number instead of an ellipsis', () => {
    expect(render(getPageItems(3, 57))).toBe('1 2 3 4 … 57');
    expect(render(getPageItems(55, 57))).toBe('1 … 54 55 56 57');
  });

  it('returns nothing for 0 pages (empty results), so no pagination is shown', () => {
    expect(getPageItems(1, 0)).toEqual([]);
  });

  it('returns the single page when there is only one, so pagination still shows', () => {
    expect(getPageItems(1, 1)).toEqual([1]);
  });

  it('clamps an out-of-range page', () => {
    expect(render(getPageItems(99, 57))).toBe('1 … 55 56 57');
    expect(render(getPageItems(0, 57))).toBe('1 2 3 … 57');
  });
});
