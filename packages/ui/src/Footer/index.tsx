const ICON_CREDITS: { author: string; href: string }[] = [];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 fit-screen:py-3 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-6">
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
        <p>
          Data from{' '}
          <a
            href="https://pokeapi.co"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            PokéAPI
          </a>
        </p>
        <p>
          Icons{' '}
          {ICON_CREDITS.length > 0 && (
            <>
              by{' '}
              {ICON_CREDITS.map((credit, i) => (
                <span key={credit.href}>
                  {i > 0 && ', '}
                  <a
                    href={credit.href}
                    className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {credit.author}
                  </a>
                </span>
              ))}{' '}
            </>
          )}
          from{' '}
          <a
            href="https://www.flaticon.com"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Flaticon
          </a>
        </p>
      </div>
    </footer>
  );
}
