"use client";

import { Button, Input } from "@pokedex/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { createPokemon, type CreatePokemonState } from "@/features/pokemon/data/actions/create-pokemon";
import type { NewPokemonField } from "@/features/pokemon/data/services/validate";
import {
  DEFAULT_STAT,
  MAX_TYPES,
  NAME_MAX_LENGTH,
  STAT_MAX,
  STAT_MIN,
  STAT_NAMES,
} from "@/features/pokemon/config/constants";

function FieldError({ errors, field }: { errors: CreatePokemonState["errors"]; field: NewPokemonField }) {
  const message = errors?.[field];
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="text-sm text-red-600">
      {message}
    </p>
  );
}

export function PokemonForm({ types, readOnly = false }: { types: string[]; readOnly?: boolean }) {
  const [state, formAction, isPending] = useActionState(createPokemon, {});
  const { errors, values, createdName } = state;
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const isBusy = isPending || isNavigating || Boolean(createdName);

  useEffect(() => {
    if (createdName) startNavigation(() => router.push(`/${createdName}`));
  }, [createdName, router]);

  return (
    <form key={JSON.stringify(values)} action={formAction} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          required
          maxLength={NAME_MAX_LENGTH}
          defaultValue={values?.name}
          placeholder="sparkymon"
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? "name-error" : undefined}
        />
        <FieldError errors={errors} field="name" />
      </div>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors?.types ? "types-error" : undefined}>
        <legend className="mb-1.5 font-medium">Types (pick up to {MAX_TYPES})</legend>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1 text-sm capitalize has-checked:border-red-500 has-checked:bg-red-50 dark:border-zinc-700 dark:has-checked:bg-red-950"
            >
              <input type="checkbox" name="types" value={type} defaultChecked={values?.types.includes(type)} />
              {type}
            </label>
          ))}
        </div>
        <FieldError errors={errors} field="types" />
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="abilities" className="font-medium">
          Abilities
        </label>
        <Input
          id="abilities"
          name="abilities"
          required
          defaultValue={values?.abilities}
          placeholder="static, lightning-rod"
          aria-invalid={Boolean(errors?.abilities)}
          aria-describedby="abilities-hint"
        />
        <p id="abilities-hint" className="text-sm text-zinc-500">
          Separate with commas.
        </p>
        <FieldError errors={errors} field="abilities" />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-medium">
          Base stats ({STAT_MIN}–{STAT_MAX})
        </legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STAT_NAMES.map((stat) => (
            <div key={stat} className="flex flex-col gap-1">
              <label htmlFor={stat} className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                {stat === "hp" ? "HP" : stat.replace("-", " ")}
              </label>
              <Input
                id={stat}
                name={stat}
                type="number"
                min={STAT_MIN}
                max={STAT_MAX}
                step={1}
                required
                defaultValue={values?.stats[stat] ?? DEFAULT_STAT}
                aria-invalid={Boolean(errors?.[stat])}
                aria-describedby={errors?.[stat] ? `${stat}-error` : undefined}
              />
              <FieldError errors={errors} field={stat} />
            </div>
          ))}
        </div>
      </fieldset>

      {state.formError && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {state.formError}
        </p>
      )}

      <Button type="submit" disabled={isBusy || readOnly} className="self-start disabled:opacity-60">
        {isBusy ? "Saving…" : "Add pokemon"}
      </Button>
    </form>
  );
}
