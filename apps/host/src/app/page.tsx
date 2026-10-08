import { Card } from "@pokedex/ui";
import Image, { type StaticImageData } from "next/image";
import arrowIcon from "@pokedex/ui/assets/arrow.png";
import berriesIcon from "@pokedex/ui/assets/berries.png";
import pikachuIcon from "@pokedex/ui/assets/pikachu.png";

const ZONES: { href: string; title: string; description: string; icon: StaticImageData }[] = [
  {
    href: "/pokemon",
    title: "Pokémon",
    description: "Search all 1,351 pokémon, see their types, abilities and base stats, and add your own.",
    icon: pikachuIcon,
  },
  {
    href: "/berries",
    title: "Berries",
    description: "Browse every berry's flavors, firmness and effect, and create custom berries.",
    icon: berriesIcon,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">Pokémon Explorer</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Explore pokémon and berries from PokéAPI, and add custom entries of your own.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ZONES.map((zone) => (
          <li key={zone.href}>
            <a href={zone.href} className="group block h-full rounded-xl">
              <Card className="flex h-full flex-col gap-4 transition-[border-color,box-shadow] group-hover:border-zinc-400 group-hover:shadow-md dark:group-hover:border-zinc-600">
                <Image src={zone.icon} alt="" width={72} height={72} loading="eager" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">{zone.title}</h2>
                  <p className="text-zinc-600 dark:text-zinc-400">{zone.description}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-red-600 group-hover:underline dark:text-red-400">
                  Explore {zone.title}
                  <Image
                    src={arrowIcon}
                    alt=""
                    width={14}
                    height={14}
                    className="rotate-180 dark:invert"
                  />
                </span>
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
