export default function Home() {
  return (
    <main className="flex flex-col gap-4 p-16">
      <h1 className="text-3xl font-semibold">Host</h1>
      <nav className="flex gap-4 underline">
        {/* Plain <a> on purpose: crossing zones needs a full page load, not <Link>. */}
        <a href="/pokemon">Pokémon</a>
        <a href="/berries">Berries</a>
      </nav>
    </main>
  );
}
