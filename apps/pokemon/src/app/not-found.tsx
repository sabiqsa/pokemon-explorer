import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Pokemon not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        No pokemon goes by that name. Check the spelling or search the list.
      </p>
      <Link prefetch={false} href="/" className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
        Back to all pokemon
      </Link>
    </main>
  );
}
