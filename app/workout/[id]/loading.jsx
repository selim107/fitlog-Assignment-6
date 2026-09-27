export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-fit grid min-h-[70vh] place-items-center rounded-2xl border border-[#2e2e2e] bg-[#121212]">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--lime)]" />
          <p className="display text-3xl font-bold uppercase">Loading workout…</p>
        </div>
      </div>
    </section>
  );
}
