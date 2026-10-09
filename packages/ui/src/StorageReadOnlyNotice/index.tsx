import { REPO_README_URL, STORAGE_READ_ONLY_MESSAGE } from '@pokedex/shared';

export function StorageReadOnlyNotice() {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
    >
      <p>{STORAGE_READ_ONLY_MESSAGE}</p>
      <a href={REPO_README_URL} className="mt-1 inline-block font-medium underline">
        How to run it locally
      </a>
    </div>
  );
}
