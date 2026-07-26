"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CATEGORIES, CATEGORY_LIST, CategoryId } from "@/lib/categories";

interface Message {
  role: "user" | "model";
  content: string;
}

const SELECTABLE_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "general", label: "General (all topics)" },
  ...CATEGORY_LIST.map((c) => ({ id: c.id, label: c.label })),
];

export default function ChatInterface({
  initialCategory,
  initialQuestion,
}: {
  initialCategory: CategoryId;
  initialQuestion?: string;
}) {
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sentInitialQuestion = useRef(false);

  useEffect(() => {
    if (initialQuestion && !sentInitialQuestion.current) {
      sentInitialQuestion.current = true;
      sendMessage(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const activeCategory = CATEGORIES[category];

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "model", content: "" }]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, messages: nextMessages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let message = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore parse failure, use default message
        }
        setError(message);
        setMessages(nextMessages);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "model", content: accumulated }]);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Network error — could not reach the server. Please try again.");
        setMessages(nextMessages);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-black/10 px-4 py-3 sm:px-6 dark:border-white/10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{activeCategory.label}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{activeCategory.tagline}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Topic:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="rounded-md border border-black/10 bg-white px-2 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-900"
            >
              {SELECTABLE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="rounded-lg border border-dashed border-black/15 p-6 text-center dark:border-white/15">
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                Try one of these to get started:
              </p>
              <div className="flex flex-col gap-2">
                {activeCategory.exampleQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-md border border-black/10 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "whitespace-pre-wrap bg-emerald-600 text-white"
                    : "prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-pre:my-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.content ? (
                  m.role === "model" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )
                ) : loading && i === messages.length - 1 ? (
                  <TypingDots />
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-black/10 px-4 py-4 sm:px-6 dark:border-white/10"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder={`Ask about ${activeCategory.label.toLowerCase()}...`}
            rows={1}
            className="max-h-40 flex-1 resize-none rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}
