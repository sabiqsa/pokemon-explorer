import { describe, expect, it } from 'vitest';
import {
  GENERIC_SAVE_ERROR_MESSAGE,
  isStorageReadOnly,
  isStorageUnavailableError,
  saveErrorMessage,
  STORAGE_READ_ONLY_MESSAGE,
} from './storage-errors';

const fsError = (code: string) => Object.assign(new Error(code), { code });

describe('isStorageReadOnly', () => {
  it('is on only when the flag is explicitly "true"', () => {
    expect(isStorageReadOnly('true')).toBe(true);
    expect(isStorageReadOnly(' TRUE ')).toBe(true);
  });

  it('is off for anything else, including a missing flag', () => {
    for (const flag of [undefined, '', 'false', '1', 'yes']) {
      expect(isStorageReadOnly(flag)).toBe(false);
    }
  });
});

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
  it.each(['EROFS', 'EACCES', 'EPERM'])('explains read-only storage for %s', (code) => {
    expect(saveErrorMessage(fsError(code))).toBe(STORAGE_READ_ONLY_MESSAGE);
  });

  it('falls back to the generic message for any other error', () => {
    expect(saveErrorMessage(fsError('ENOSPC'))).toBe(GENERIC_SAVE_ERROR_MESSAGE);
    expect(saveErrorMessage(new Error('boom'))).toBe(GENERIC_SAVE_ERROR_MESSAGE);
  });
});
