import { describe, expect, it } from 'vitest';
import { isStorageUnavailableError, saveErrorMessage } from './storage-errors';

const fsError = (code: string) => Object.assign(new Error(code), { code });

describe('isStorageUnavailableError', () => {
  it.each(['EROFS', 'EACCES', 'EPERM'])('treats %s as read-only storage', (code) => {
    expect(isStorageUnavailableError(fsError(code))).toBe(true);
  });

  it('ignores other errors and non-errors', () => {
    expect(isStorageUnavailableError(fsError('ENOSPC'))).toBe(false);
    expect(isStorageUnavailableError(new Error('boom'))).toBe(false);
    expect(isStorageUnavailableError('EROFS')).toBe(false);
    expect(isStorageUnavailableError(null)).toBe(false);
  });
});

describe('saveErrorMessage', () => {
  it('explains the demo deployment limit for read-only storage', () => {
    expect(saveErrorMessage(fsError('EROFS'), 'pokemon')).toBe(
      "Custom pokemon can't be saved on this demo deployment (its storage is read-only). Run the app locally to add or delete custom pokemon.",
    );
  });

  it('falls back to a generic message for anything else', () => {
    expect(saveErrorMessage(new Error('boom'), 'berries')).toBe('Something went wrong while saving. Please try again.');
  });
});
