export const STORAGE_READ_ONLY_MESSAGE =
  "Custom entries can't be saved on this demo deployment because storage is read-only. Run the app locally to try this feature.";
export const GENERIC_SAVE_ERROR_MESSAGE = 'Something went wrong while saving. Please try again.';
export const REPO_README_URL = 'https://github.com/sabiqsa/pokemon-explorer#getting-started';

const READ_ONLY_CODES = new Set(['EROFS', 'EACCES', 'EPERM']);

export function isStorageReadOnly(flag: string | undefined): boolean {
  return flag?.trim().toLowerCase() === 'true';
}

export function isStorageUnavailableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return READ_ONLY_CODES.has(String(error.code));
}

export function saveErrorMessage(error: unknown): string {
  return isStorageUnavailableError(error) ? STORAGE_READ_ONLY_MESSAGE : GENERIC_SAVE_ERROR_MESSAGE;
}
