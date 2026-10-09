import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const { BackLink } = await import('./index');
const { CatalogAddLink } = await import('../CatalogAddLink');
const { CatalogCard } = await import('../CatalogCard');

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('BackLink', () => {
  it('falls back to the plain href when no list was visited', () => {
    window.history.replaceState(null, '', '/pokemon/pikachu');
    render(<BackLink href="/">All pokemon</BackLink>);
    expect(screen.getByRole('link', { name: 'All pokemon' }).getAttribute('href')).toBe('/');
  });

  it('returns to the list page and search the card was opened from', () => {
    window.history.replaceState(null, '', '/pokemon?q=pi&page=3');
    render(<CatalogCard href="/pikachu" name="Pikachu" imageUrl={null} isCustom={false} />);
    fireEvent.click(screen.getByRole('link', { name: /Pikachu/ }));
    cleanup();

    window.history.replaceState(null, '', '/pokemon/pikachu');
    render(<BackLink href="/">All pokemon</BackLink>);
    expect(screen.getByRole('link', { name: 'All pokemon' }).getAttribute('href')).toBe('/?q=pi&page=3');
  });

  it('returns to the list page the add link was opened from', () => {
    window.history.replaceState(null, '', '/pokemon?page=5');
    render(<CatalogAddLink href="/new" label="Add custom pokemon" />);
    fireEvent.click(screen.getByRole('link', { name: 'Add custom pokemon' }));
    cleanup();

    window.history.replaceState(null, '', '/pokemon/new');
    render(<BackLink href="/">All pokemon</BackLink>);
    expect(screen.getByRole('link', { name: 'All pokemon' }).getAttribute('href')).toBe('/?page=5');
  });

  it('keeps each zone separate', () => {
    window.history.replaceState(null, '', '/pokemon?page=3');
    render(<CatalogCard href="/pikachu" name="Pikachu" imageUrl={null} isCustom={false} />);
    fireEvent.click(screen.getByRole('link', { name: /Pikachu/ }));
    cleanup();

    window.history.replaceState(null, '', '/berries/cheri');
    render(<BackLink href="/">All berries</BackLink>);
    expect(screen.getByRole('link', { name: 'All berries' }).getAttribute('href')).toBe('/');
  });
});
