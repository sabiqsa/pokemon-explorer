export function Footer() {
  return (
    <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-6xl px-4 py-6 fit-screen:py-3">
        <p>
          Created by{' '}
          <a
            href="https://github.com/sabiqsa/pokemon-explorer"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            sabiqsa
          </a>{' '}
          © 2026
        </p>
      </div>
    </footer>
  );
}
