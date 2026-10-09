const REPO_URL = 'https://github.com/sabiqsa/pokemon-explorer';
const linkClass = 'underline hover:text-zinc-900 dark:hover:text-zinc-100';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 fit-screen:py-3 sm:flex-row sm:justify-between">
        <p>
          Created by{' '}
          <a href={REPO_URL} className={linkClass}>
            sabiqsa
          </a>{' '}
          © 2026
        </p>
      </div>
    </footer>
  );
}
