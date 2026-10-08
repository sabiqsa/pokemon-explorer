import Image from 'next/image';
import pikachuIcon from '../Assets/pikachu.png';
import { ThemeToggle } from '../ThemeToggle';

export type NavbarSection = 'home' | 'pokemon' | 'berries';

const MENU: {
  section: Exclude<NavbarSection, 'home'>;
  label: string;
  href: string;
}[] = [
  { section: 'pokemon', label: 'Pokémon', href: '/pokemon' },
  { section: 'berries', label: 'Berries', href: '/berries' },
];

export function Navbar({ active }: { active?: NavbarSection }) {
  return (
    <header className="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:gap-6"
      >
        <a
          href="/"
          aria-current={active === 'home' ? 'page' : undefined}
          className="mr-auto flex items-center gap-2 rounded-md font-semibold"
        >
          <Image
            src={pikachuIcon}
            alt=""
            width={28}
            height={28}
            loading="eager"
          />
          <span className="hidden sm:inline">Pokémon Explorer</span>
          <span className="sr-only sm:hidden">Pokémon Explorer home</span>
        </a>

        <ul className="flex items-center gap-1 sm:gap-2">
          {MENU.map((item) => {
            const isActive = active === item.section;
            return (
              <li key={item.section}>
                <a
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  );
}
