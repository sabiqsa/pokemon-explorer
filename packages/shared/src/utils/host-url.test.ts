import { describe, expect, it } from 'vitest';
import { hostUrl } from './host-url';

describe('hostUrl', () => {
  it('returns a relative path when there is no host URL (local dev)', () => {
    expect(hostUrl('/berries')).toBe('/berries');
    expect(hostUrl('/berries', '')).toBe('/berries');
    expect(hostUrl('/berries', '   ')).toBe('/berries');
  });

  it('prefixes the host URL when it is set', () => {
    expect(hostUrl('/berries', 'https://pokemon-explorer.vercel.app')).toBe('https://pokemon-explorer.vercel.app/berries');
  });

  it('never produces a double slash between host and path', () => {
    expect(hostUrl('/pokemon', 'https://host.app/')).toBe('https://host.app/pokemon');
    expect(hostUrl('//pokemon', 'https://host.app//')).toBe('https://host.app/pokemon');
  });

  it('adds a missing leading slash to the path', () => {
    expect(hostUrl('berries', 'https://host.app')).toBe('https://host.app/berries');
    expect(hostUrl('berries')).toBe('/berries');
  });

  it('links to the host root', () => {
    expect(hostUrl('/', 'https://host.app')).toBe('https://host.app/');
    expect(hostUrl('')).toBe('/');
  });

  it('keeps the protocol slashes and any query string', () => {
    expect(hostUrl('/pokemon?q=mew', 'http://localhost:3000')).toBe('http://localhost:3000/pokemon?q=mew');
  });
});
