export type CategoryId =
  | "ai"
  | "cybersecurity"
  | "ai-cybersecurity"
  | "prompt-engineering"
  | "general";

export interface Category {
  id: CategoryId;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  exampleQuestions: string[];
  highlights: { title: string; blurb: string }[];
  systemPrompt: string;
}

const HEDGING_RULES = `
Guidelines for every answer:
- Be accurate and clear. If you are not confident about a fact, model version, statistic, tool name, or identifier (especially CVE IDs), say so explicitly instead of guessing.
- Never invent CVE IDs, product names, statistics, or citations. If asked for something specific you don't have reliable knowledge of, say you're not certain and suggest how the user could verify it (e.g. "check the NVD database" or "check the vendor's advisory").
- Fast-moving topics (zero-days, recent breaches, very recent model releases) change quickly; flag that your knowledge may be out of date and encourage the user to check a current, authoritative source.
- Keep answers focused and practical. Use short paragraphs or bullet points where helpful.
- Stay on-topic for your assigned category unless the user is in "General" mode.
`.trim();

export const CATEGORIES: Record<CategoryId, Category> = {
  ai: {
    id: "ai",
    label: "Artificial Intelligence",
    shortLabel: "AI",
    tagline: "Concepts, models, tools, and trends",
    description:
      "Learn how modern AI systems work: large language models, training vs. inference, prompting, agents, and the tools and trends shaping the field.",
    exampleQuestions: [
      "What's the difference between training and fine-tuning a model?",
      "How does retrieval-augmented generation (RAG) work?",
      "What is an AI agent, and how is it different from a chatbot?",
      "What should I know about context windows and tokens?",
    ],
    highlights: [
      { title: "Foundation models", blurb: "How large language models are built and what makes them capable." },
      { title: "Prompting & agents", blurb: "Getting useful output from models, and chaining them into agents." },
      { title: "AI tooling landscape", blurb: "Frameworks, vector databases, and the modern AI stack." },
    ],
    systemPrompt: `You are an expert AI tutor inside "SecureAI Hub", a knowledge portal. Your job is to answer questions about artificial intelligence: concepts, model architectures, training, tools, frameworks, and industry trends. Explain things clearly for a curious learner, using precise terminology but not unnecessary jargon.\n\n${HEDGING_RULES}`,
  },
  cybersecurity: {
    id: "cybersecurity",
    label: "Cyber Security",
    shortLabel: "Cyber Security",
    tagline: "Threats, defenses, best practices, and compliance",
    description:
      "Understand the threat landscape, core defenses, and the compliance frameworks that shape modern security programs.",
    exampleQuestions: [
      "What's the difference between phishing and spear phishing?",
      "What are the core principles of zero trust architecture?",
      "How do I explain defense-in-depth to a non-technical stakeholder?",
      "What does a SOC 2 audit actually check for?",
    ],
    highlights: [
      { title: "Threats & attacks", blurb: "Common attack techniques and how they're categorized (e.g. MITRE ATT&CK)." },
      { title: "Defensive practices", blurb: "Hardening, monitoring, incident response, and security hygiene." },
      { title: "Compliance frameworks", blurb: "SOC 2, ISO 27001, NIST, GDPR, and how they relate." },
    ],
    systemPrompt: `You are an expert cyber security educator inside "SecureAI Hub", a knowledge portal. Your job is to answer questions about security threats, defensive practices, security architecture, and compliance frameworks. Be precise about technical terms, and be careful never to provide actionable exploit instructions for real, unpatched vulnerabilities — focus on concepts, defenses, and general education rather than step-by-step attack instructions.\n\n${HEDGING_RULES}`,
  },
  "ai-cybersecurity": {
    id: "ai-cybersecurity",
    label: "AI + Cyber Security",
    shortLabel: "AI + CyberSec",
    tagline: "Where artificial intelligence and security meet",
    description:
      "Explore how AI is changing offense and defense: AI-powered attacks, securing AI systems themselves, and AI in the modern SOC.",
    exampleQuestions: [
      "How are attackers using AI to make phishing more convincing?",
      "What is prompt injection, and why is it a security concern?",
      "How can AI help a SOC triage alerts faster?",
      "What does it mean to secure an LLM-powered application?",
    ],
    highlights: [
      { title: "AI-powered attacks", blurb: "Deepfakes, AI-assisted phishing, and automated recon." },
      { title: "Securing AI systems", blurb: "Prompt injection, data poisoning, model theft, and mitigations." },
      { title: "AI in the SOC", blurb: "Using AI for detection, triage, and threat hunting." },
    ],
    systemPrompt: `You are an expert educator inside "SecureAI Hub", a knowledge portal, focused specifically on the intersection of AI and cyber security: AI-powered attacks and defenses, securing AI/ML systems (e.g. prompt injection, data poisoning, model extraction), and the use of AI in security operations centers. Do not give actionable exploit instructions; focus on concepts, risks, and defensive best practices.\n\n${HEDGING_RULES}`,
  },
  "prompt-engineering": {
    id: "prompt-engineering",
    label: "Prompt Engineering",
    shortLabel: "Prompt Engineering",
    tagline: "Getting better results out of AI models",
    description:
      "Learn how to write effective prompts: reusable techniques, patterns for structuring instructions, and common pitfalls that lead to unreliable output.",
    exampleQuestions: [
      "What's the difference between zero-shot and few-shot prompting?",
      "How does chain-of-thought prompting improve reasoning?",
      "What makes a good system prompt?",
      "How do I reduce hallucinations through prompting alone?",
    ],
    highlights: [
      { title: "Prompting patterns", blurb: "Few-shot, chain-of-thought, role prompting, and other reusable techniques." },
      { title: "System prompts", blurb: "Structuring instructions to keep a model on-task and well-behaved." },
      { title: "Common pitfalls", blurb: "Ambiguity, overlong instructions, and why more text isn't always better." },
    ],
    systemPrompt: `You are an expert in prompt engineering inside "SecureAI Hub", a knowledge portal. Your job is to answer questions about writing effective prompts for large language models: prompting techniques (zero-shot, few-shot, chain-of-thought, role prompting), system prompt design, structuring instructions and context, and debugging unreliable model output. If a question is really about prompt injection or securing an AI system against adversarial input, mention that "AI + Cyber Security" is the better category for that, but still give a helpful answer.\n\n${HEDGING_RULES}`,
  },
  general: {
    id: "general",
    label: "General",
    shortLabel: "General",
    tagline: "Search across AI, Cyber Security, and their intersection",
    description:
      "Ask anything across all three topic areas. The assistant will draw on AI, cyber security, and AI+security knowledge as needed.",
    exampleQuestions: [
      "How do I get started learning both AI and cyber security?",
      "What career paths combine AI and security skills?",
      "Compare traditional malware detection to AI-based detection.",
    ],
    highlights: [],
    systemPrompt: `You are the general-purpose assistant inside "SecureAI Hub", a knowledge portal covering three areas: Artificial Intelligence, Cyber Security, and the intersection of AI + Cyber Security. Answer questions from any of these areas, drawing connections between them where relevant.\n\n${HEDGING_RULES}`,
  },
};

export const CATEGORY_LIST: Category[] = [
  CATEGORIES.ai,
  CATEGORIES.cybersecurity,
  CATEGORIES["ai-cybersecurity"],
  CATEGORIES["prompt-engineering"],
];

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return (
    value === "ai" ||
    value === "cybersecurity" ||
    value === "ai-cybersecurity" ||
    value === "prompt-engineering" ||
    value === "general"
  );
}
