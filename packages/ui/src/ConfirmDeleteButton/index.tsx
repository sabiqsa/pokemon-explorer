"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Button } from "../Button";

export type DeleteState = { error?: string; deleted?: boolean };

type ConfirmDeleteButtonProps = {
  title: string;
  description: string;
  action: () => Promise<DeleteState>;
  redirectTo: string;
};

export function ConfirmDeleteButton({ title, description, action, redirectTo }: ConfirmDeleteButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await action();
      if (result.deleted) router.replace(redirectTo);
      else setError(result.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="self-start rounded-md border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        onClick={(event) => {
          if (event.target === event.currentTarget && !isPending) dialogRef.current?.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-white p-0 text-zinc-900 backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <form onSubmit={confirmDelete} className="flex flex-col gap-4 p-6">
          <h2 id="delete-title" className="text-lg font-semibold">
            {title}
          </h2>
          <p id="delete-description" className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
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
