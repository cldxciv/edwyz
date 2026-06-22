export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "future-of-ai-agents-in-enterprise",
    title: "The future of AI agents in the enterprise",
    excerpt: "Why autonomous, tool-using AI agents are becoming the default interface for enterprise workflows.",
    category: "Artificial Intelligence",
    author: "Edwyz Research Team",
    date: "2026-05-12",
    readingTime: "6 min read",
    content: [
      "AI agents are moving from novelty to necessity inside the enterprise. Where last year's chatbots answered questions, this year's agents take action — booking, updating, escalating, and resolving without a human in the loop for routine cases.",
      "The shift is architectural as much as it is technological: agents need reliable tool access, memory, and guardrails, not just a bigger model.",
      "Organizations that win with agents treat them as products with owners, metrics, and iteration cycles — not as a one-time integration.",
    ],
  },
  {
    slug: "rag-vs-fine-tuning",
    title: "RAG vs. fine-tuning: choosing the right approach for your LLM application",
    excerpt: "A practical framework for deciding between retrieval-augmented generation and fine-tuning.",
    category: "LLM Development",
    author: "Edwyz Research Team",
    date: "2026-04-28",
    readingTime: "8 min read",
    content: [
      "Retrieval-augmented generation (RAG) and fine-tuning solve different problems, and conflating them leads to wasted engineering effort.",
      "RAG is the right default when your knowledge changes frequently and you need traceability back to source documents.",
      "Fine-tuning earns its cost when you need consistent style, structured output formats, or domain-specific reasoning patterns that retrieval alone can't teach.",
    ],
  },
  {
    slug: "data-engineering-foundations-for-ai",
    title: "Why your AI strategy is only as good as your data engineering",
    excerpt: "Most failed AI initiatives are actually failed data initiatives. Here's how to fix the foundation.",
    category: "Data Engineering",
    author: "Edwyz Research Team",
    date: "2026-04-10",
    readingTime: "5 min read",
    content: [
      "Teams consistently underestimate the data engineering work required before any model can deliver value.",
      "Pipeline reliability, data quality monitoring, and a coherent data model matter more than model selection in most real-world AI projects.",
      "Investing in the data foundation first pays compounding returns across every AI initiative that follows.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
