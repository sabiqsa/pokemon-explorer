"use client";

import { Button } from "@pokedex/ui";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Couldn’t load berries</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        PokéAPI may be down or slow right now. Check your connection and try again.
      </p>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  );
}
