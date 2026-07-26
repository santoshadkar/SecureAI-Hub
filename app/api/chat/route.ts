import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { CATEGORIES, isCategoryId } from "@/lib/categories";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash-lite";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

function getClientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI["models"]["generateContentStream"]>[0],
  maxRetries = 3
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await ai.models.generateContentStream(params);
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const isRetryable = status === 429 || (status !== undefined && status >= 500);
      if (!isRetryable || attempt === maxRetries - 1) throw err;
      const backoffMs = 500 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing GEMINI_API_KEY." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { allowed, retryAfterMs } = checkRateLimit(getClientKey(req));
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please wait a moment before trying again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        },
      }
    );
  }

  let body: { category?: string; messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const categoryId = isCategoryId(body.category) ? body.category : "general";
  const category = CATEGORIES[categoryId];
  const messages = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES);
  const lastMessage = trimmedHistory[trimmedHistory.length - 1];
  if (!lastMessage || lastMessage.role !== "user" || !lastMessage.content?.trim()) {
    return new Response(JSON.stringify({ error: "Last message must be from the user." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const contents = trimmedHistory.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const ai = new GoogleGenAI({ apiKey });

  try {
    const streamResult = await callGeminiWithRetry(ai, {
      model: MODEL,
      contents,
      config: { systemInstruction: category.systemPrompt },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamResult) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              "\n\n[Error while streaming the response. Please try again.]"
            )
          );
          console.error("Gemini streaming error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const status = (err as { status?: number })?.status;
    console.error("Gemini API error:", err);
    if (status === 429) {
      return new Response(
        JSON.stringify({ error: "The AI service is currently rate-limited. Please try again shortly." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to get a response from the AI service. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
