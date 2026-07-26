import Link from "next/link";
import { Category } from "@/lib/categories";

export default function CategoryLanding({ category }: { category: Category }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
        {category.tagline}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{category.label}</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">{category.description}</p>

      <Link
        href={`/chat?category=${category.id}`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Chat about {category.shortLabel}
        <span aria-hidden>→</span>
      </Link>

      {category.highlights.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {category.highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-xl border border-black/10 p-5 dark:border-white/10"
            >
              <h3 className="font-semibold">{h.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{h.blurb}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Example questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {category.exampleQuestions.map((q) => (
            <Link
              key={q}
              href={`/chat?category=${category.id}&q=${encodeURIComponent(q)}`}
              className="rounded-md border border-black/10 px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
