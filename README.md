# SecureAI Hub

A knowledge portal + AI chatbot covering three topic areas:

- **Artificial Intelligence** — concepts, models, tools, trends
- **Cyber Security** — threats, defenses, best practices, compliance
- **AI + Cyber Security** — AI-powered attacks/defenses, securing AI systems, AI in the SOC

Each category has a landing page with example questions, and a chatbot (`/chat`) that is
category-aware, powered live by the Google Gemini API. Chat history is in-memory per session
only — there is no database and no persistent chat history.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- `@google/genai` SDK, called server-side from `app/api/chat/route.ts` (API key never reaches the client)
- Model: `gemini-3.5-flash-lite`
- Streaming responses, basic in-memory rate limiting with retry/backoff on the Gemini call

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable         | Description                          |
| ---------------- | ------------------------------------- |
| `GEMINI_API_KEY`  | API key for the Google Gemini API     |

## Deploying

Deployed on Vercel. Set `GEMINI_API_KEY` as a project environment variable in the Vercel
dashboard (or `vercel env add GEMINI_API_KEY`) before deploying to production.
