import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { getPayloadClient } from "@/lib/payload";

export type KnowledgeChunk = {
  title: string;
  text: string;
  url: string;
};

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function lexicalToPlainText(content: unknown): string {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return "";

  const parts: string[] = [];
  const walk = (node: LexicalNode) => {
    if (typeof node.text === "string") parts.push(node.text);
    node.children?.forEach(walk);
  };
  walk(root);
  return parts.join(" ");
}

let cache: { chunks: KnowledgeChunk[]; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function getKnowledgeChunks(): Promise<KnowledgeChunk[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.chunks;

  const chunks: KnowledgeChunk[] = [];

  for (const s of services) {
    chunks.push({
      title: `Service: ${s.name}`,
      text: `${s.name}. ${s.description} Capabilities: ${s.capabilities.join(", ")}.`,
      url: `/services/${s.slug}`,
    });
  }

  for (const i of industries) {
    chunks.push({
      title: `Industry: ${i.name}`,
      text: `${i.name}. ${i.description}`,
      url: `/industries/${i.slug}`,
    });
  }

  const payload = await getPayloadClient();

  const { docs: caseStudies } = await payload.find({ collection: "case-studies", limit: 100 });
  for (const cs of caseStudies) {
    const results = cs.results.map((r: { label: string; value: string }) => `${r.label}: ${r.value}`).join(", ");
    chunks.push({
      title: `Case Study: ${cs.title}`,
      text: `Client: ${cs.client}. Industry: ${cs.industry}. ${cs.summary} Challenge: ${cs.challenge} Solution: ${cs.solution} Results: ${results}.`,
      url: `/case-studies/${cs.slug}`,
    });
  }

  const { docs: posts } = await payload.find({ collection: "posts", limit: 100 });
  for (const post of posts) {
    chunks.push({
      title: `Blog: ${post.title}`,
      text: `${post.excerpt} ${lexicalToPlainText(post.content)}`,
      url: `/blog/${post.slug}`,
    });
  }

  cache = { chunks, expiresAt: Date.now() + CACHE_TTL_MS };
  return chunks;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "for", "with", "on", "is", "are",
  "what", "how", "do", "you", "your", "i", "we", "can", "does", "it", "this", "that",
  "be", "have", "has", "about", "me", "tell", "us",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export async function retrieveRelevantChunks(query: string, topN = 5): Promise<KnowledgeChunk[]> {
  const chunks = await getKnowledgeChunks();
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return chunks.slice(0, topN);

  const scored = chunks.map((chunk) => {
    const chunkTerms = tokenize(`${chunk.title} ${chunk.text}`);
    const score = queryTerms.reduce((sum, term) => sum + chunkTerms.filter((t) => t.includes(term)).length, 0);
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((s) => s.score > 0).slice(0, topN);

  return relevant.length > 0 ? relevant.map((s) => s.chunk) : chunks.slice(0, topN);
}
