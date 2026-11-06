import { BerryDetailSkeleton } from "@/features/berries/components/BerryDetailSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <BerryDetailSkeleton />
    </main>
  );
}
