import { FormSkeleton, Skeleton } from "@pokedex/ui";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-9 w-64 rounded" />
      <FormSkeleton fields={6} />
    </main>
  );
}
