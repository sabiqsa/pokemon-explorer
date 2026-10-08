"use client";

import { Button } from "@pokedex/ui";
import { useActionState, useRef } from "react";
import { deletePokemon } from "@/features/pokemon/data/actions/delete-pokemon";
import { displayName } from "@/features/pokemon/utils/helper";

/** Step 1: "Delete" opens a modal. Step 2: confirming inside the modal runs the action. */
export function DeletePokemonButton({ id, name }: { id: string; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(deletePokemon.bind(null, id), {});

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="self-start rounded-md border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        Delete
      </button>

      {/* Native <dialog> + showModal() gives focus trapping, Esc to close and a backdrop for free. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        // Click on the backdrop (the dialog element itself, outside its content) closes it.
        onClick={(event) => {
          if (event.target === event.currentTarget && !isPending) dialogRef.current?.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-white p-0 text-zinc-900 backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <form action={formAction} className="flex flex-col gap-4 p-6">
          <h2 id="delete-title" className="text-lg font-semibold">
            Delete {displayName(name)}?
          </h2>
          <p id="delete-description" className="text-sm text-zinc-600 dark:text-zinc-400">
            This permanently removes it from your custom pokemon. You can’t undo this.
          </p>
          {state.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              autoFocus
              disabled={isPending}
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-4 py-2 font-medium hover:bg-zinc-100 disabled:opacity-60 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isPending} className="disabled:opacity-60">
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
