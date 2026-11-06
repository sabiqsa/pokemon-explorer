import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigation = vi.hoisted(() => ({
  replace: vi.fn(),
  pathname: '/',
  search: '',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigation.replace }),
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const { useUpdateSearchParams } = await import('./useUpdateSearchParams');

function update(updates: Record<string, string | null>) {
  const { result } = renderHook(() => useUpdateSearchParams());
  result.current(updates);
}

beforeEach(() => {
  navigation.replace.mockClear();
  navigation.pathname = '/';
  navigation.search = '';
});

describe('useUpdateSearchParams', () => {
  it('sets q and page in the URL', () => {
    update({ q: 'char', page: '2' });
    expect(navigation.replace).toHaveBeenCalledWith('/?q=char&page=2', { scroll: false });
  });

  it('resets the page when the search query changes', () => {
    navigation.search = 'q=pika&page=4';
    update({ q: 'char', page: null });
    expect(navigation.replace).toHaveBeenCalledWith('/?q=char', { scroll: false });
  });

  it('keeps other params and only changes the given keys', () => {
    navigation.search = 'q=char&page=1';
    update({ page: '3' });
    expect(navigation.replace).toHaveBeenCalledWith('/?q=char&page=3', { scroll: false });
  });

  it('drops the query string entirely when every param is cleared', () => {
    navigation.pathname = '/new';
    navigation.search = 'q=char';
    update({ q: null, page: null });
    expect(navigation.replace).toHaveBeenCalledWith('/new', { scroll: false });
  });
});
