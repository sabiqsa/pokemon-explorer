"use client";

import { Button, Input, Select } from "@pokedex/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { createBerry, type CreateBerryState } from "@/features/berries/data/actions/create-berry";
import type { NewBerryField } from "@/features/berries/data/services/validate";
import {
  DEFAULT_FLAVOR,
  EFFECT_MAX_LENGTH,
  FLAVOR_MAX,
  FLAVOR_MIN,
  FLAVOR_NAMES,
  GROWTH_TIME_MAX,
  GROWTH_TIME_MIN,
  MAX_HARVEST_MAX,
  MAX_HARVEST_MIN,
  NAME_MAX_LENGTH,
  SIZE_MAX,
  SIZE_MIN,
} from "@/features/berries/config/constants";

function FieldError({ errors, field }: { errors: CreateBerryState["errors"]; field: NewBerryField }) {
  const message = errors?.[field];
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="text-sm text-red-600">
      {message}
    </p>
  );
}

type NumberFieldProps = {
  name: "sizeMm" | "growthTimeHours" | "maxHarvest";
  label: string;
  min: number;
  max: number;
  defaultValue?: string;
  errors: CreateBerryState["errors"];
};

function NumberField({ name, label, min, max, defaultValue, errors }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        step={1}
        required
        defaultValue={defaultValue}
        aria-invalid={Boolean(errors?.[name])}
        aria-describedby={errors?.[name] ? `${name}-error` : undefined}
      />
      <FieldError errors={errors} field={name} />
    </div>
  );
}

export function BerryForm({ firmnesses }: { firmnesses: string[] }) {
  const [state, formAction, isPending] = useActionState(createBerry, {});
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
          maxLength={NAME_MAX_LENGTH + " berry".length}
          defaultValue={values?.name}
          placeholder="moonglow"
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? "name-hint name-error" : "name-hint"}
        />
        <p id="name-hint" className="text-sm text-zinc-500">
          “Berry” is added for you, so “moonglow” shows as Moonglow Berry.
        </p>
        <FieldError errors={errors} field="name" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="firmness" className="font-medium">
          Firmness
        </label>
        <Select
          id="firmness"
          name="firmness"
          required
          defaultValue={values?.firmness ?? ""}
          aria-invalid={Boolean(errors?.firmness)}
          aria-describedby={errors?.firmness ? "firmness-error" : undefined}
          className="capitalize"
        >
          <option value="" disabled>
            Choose firmness
          </option>
          {firmnesses.map((firmness) => (
            <option key={firmness} value={firmness}>
              {firmness.replace("-", " ")}
            </option>
          ))}
        </Select>
        <FieldError errors={errors} field="firmness" />
      </div>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors?.flavors ? "flavors-error" : undefined}>
        <legend className="mb-1.5 font-medium">
          Flavor potency ({FLAVOR_MIN}–{FLAVOR_MAX}, at least one above 0)
        </legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {FLAVOR_NAMES.map((flavor) => (
            <div key={flavor} className="flex flex-col gap-1">
              <label htmlFor={flavor} className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                {flavor}
              </label>
              <Input
                id={flavor}
                name={flavor}
                type="number"
                min={FLAVOR_MIN}
                max={FLAVOR_MAX}
                step={1}
                required
                defaultValue={values?.flavors[flavor] ?? DEFAULT_FLAVOR}
                aria-invalid={Boolean(errors?.[flavor] || errors?.flavors)}
                aria-describedby={errors?.[flavor] ? `${flavor}-error` : undefined}
              />
              <FieldError errors={errors} field={flavor} />
            </div>
          ))}
        </div>
        <FieldError errors={errors} field="flavors" />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField name="sizeMm" label="Size (mm)" min={SIZE_MIN} max={SIZE_MAX} defaultValue={values?.sizeMm} errors={errors} />
        <NumberField
          name="growthTimeHours"
          label="Growth time (hours)"
          min={GROWTH_TIME_MIN}
          max={GROWTH_TIME_MAX}
          defaultValue={values?.growthTimeHours}
          errors={errors}
        />
        <NumberField
          name="maxHarvest"
          label="Max harvest"
          min={MAX_HARVEST_MIN}
          max={MAX_HARVEST_MAX}
          defaultValue={values?.maxHarvest}
          errors={errors}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="effect" className="font-medium">
          Effect <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <Input
          id="effect"
          name="effect"
          maxLength={EFFECT_MAX_LENGTH}
          defaultValue={values?.effect}
          placeholder="Restores 10 HP when held."
          aria-invalid={Boolean(errors?.effect)}
          aria-describedby={errors?.effect ? "effect-error" : undefined}
        />
        <FieldError errors={errors} field="effect" />
      </div>

      {state.formError && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {state.formError}
        </p>
      )}

      <Button type="submit" disabled={isBusy} className="self-start disabled:opacity-60">
        {isBusy ? "Saving…" : "Add berry"}
      </Button>
    </form>
  );
}
