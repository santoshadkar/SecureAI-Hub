import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Knowledge portal + AI chatbot
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">SecureAI Hub</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Explore Artificial Intelligence, Cyber Security, and where the two meet. Ask
          questions in plain English and get answers from an AI chatbot, grounded in the
          topic you care about.
        </p>
        <Link
          href="/chat"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Start chatting
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {CATEGORY_LIST.map((category) => (
          <Link
            key={category.id}
            href={`/${category.id}`}
            className="group rounded-xl border border-black/10 p-6 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:border-white/10"
          >
            <h2 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {category.label}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{category.tagline}</p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
