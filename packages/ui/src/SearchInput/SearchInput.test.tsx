import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const updateSearchParams = vi.fn();
let search = '';

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(search) }));
vi.mock('@pokedex/shared/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pokedex/shared/hooks')>()),
  useUpdateSearchParams: () => updateSearchParams,
}));

const { SearchInput } = await import('./index');
const { SEARCH_DEBOUNCE_MS } = await import('@pokedex/shared');

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  search = '';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function type(value: string) {
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search pokemon' }), { target: { value } });
}

describe('SearchInput', () => {
  it('starts with the query from the URL', () => {
    search = 'q=pika&page=2';
    render(<SearchInput label="Search pokemon" />);
    expect(screen.getByRole<HTMLInputElement>('searchbox').value).toBe('pika');
  });

  it('updates the URL once typing stops and resets to page 1', () => {
    render(<SearchInput label="Search pokemon" />);
    type('p');
    type('pi');
    type('pika ');

    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    expect(updateSearchParams).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(updateSearchParams).toHaveBeenCalledOnce();
    expect(updateSearchParams).toHaveBeenCalledWith({ q: 'pika', page: null });
  });

  it('removes q from the URL when the box is cleared', () => {
    search = 'q=pika';
    render(<SearchInput label="Search pokemon" />);
    type('');

    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    expect(updateSearchParams).toHaveBeenCalledWith({ q: null, page: null });
  });
});
