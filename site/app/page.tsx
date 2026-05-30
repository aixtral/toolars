const popularTools = [
  'BMI Calculator',
  'Mortgage Calculator',
  'Compound Interest Calculator',
  'AI Content Repurposer',
];

const categories = [
  'AI Content',
  'Body',
  'Fitness & Nutrition',
  'Wellness',
  'Wealth',
  'Finance Calculators',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFC] text-[#0F172A]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex items-center justify-between">
          <span className="text-2xl font-semibold">toolars</span>
          <button className="rounded-lg bg-[#14B8A6] px-4 py-2 text-sm font-semibold text-white">
            Open app
          </button>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-medium text-[#0D9488]">
            Free calculators. Subscription AI tools.
          </p>
          <h1 className="text-4xl font-semibold">
            Search 73 calculators and AI tools
          </h1>
          <div className="mt-6">
            <label className="sr-only" htmlFor="home-search">
              Search tools
            </label>
            <input
              id="home-search"
              type="search"
              aria-label="Search tools"
              placeholder="Search 73 calculators and AI tools..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-[#2563EB]">Featured AI Tool</p>
            <h2 className="mt-2 text-xl font-semibold">AI Content Repurposer</h2>
            <p className="mt-2 text-sm text-slate-600">
              Transform one source into social posts, email, articles, and more.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 md:col-span-2">
            <h2 className="text-xl font-semibold">Popular Tools</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {popularTools.map((tool) => (
                <li key={tool} className="rounded-lg border border-slate-200 px-3 py-2">
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-lg border border-slate-200 bg-white p-4">
              {category}
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

