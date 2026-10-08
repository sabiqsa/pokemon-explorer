const READ_ONLY_CODES = new Set(['EROFS', 'EACCES', 'EPERM']);

export function isStorageUnavailableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return READ_ONLY_CODES.has(String(error.code));
}

export function saveErrorMessage(error: unknown, noun: string): string {
  if (isStorageUnavailableError(error)) {
    return `Custom ${noun} can't be saved on this demo deployment (its storage is read-only). Run the app locally to add or delete custom ${noun}.`;
  }
  return 'Something went wrong while saving. Please try again.';
}
