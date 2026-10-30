export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "italic"; v: string }
  | { t: "code"; v: string }
  | { t: "link"; v: string; href: string };

export type Block =
  | { type: "p"; inline: Inline[] }
  | { type: "h"; inline: Inline[] }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] };

export type ParsedChat = { blocks: Block[]; suggestions: string[] };

const SUGGEST = /<<suggest:\s*([\s\S]*?)>>\s*$/i;
const MAX_SUGGESTIONS = 3;
const MAX_SUGGESTION_LENGTH = 40;

/** Only http(s), mailto and same-site paths are ever turned into links. Everything else stays plain text. */
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^https?:\/\/[^\s]+$/i.test(href)) return href;
  if (/^mailto:[^\s]+$/i.test(href)) return href;
  if (/^\/(?!\/)[^\s]*$/.test(href)) return href;
  return null;
}

const INLINE = /\[([^\]\n]{1,120})\]\(([^)\s]{1,300})\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`|(?<![*\w])\*([^*\n]+)\*(?!\*)|(https?:\/\/[^\s<>)]+[^\s<>).,;:!?])/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const index = m.index ?? 0;
    if (index > last) out.push({ t: "text", v: text.slice(last, index) });
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      out.push(href ? { t: "link", v: m[1], href } : { t: "text", v: m[0] });
    } else if (m[3] !== undefined) out.push({ t: "bold", v: m[3] });
    else if (m[4] !== undefined) out.push({ t: "code", v: m[4] });
    else if (m[5] !== undefined) out.push({ t: "italic", v: m[5] });
    else if (m[6] !== undefined) {
      const href = safeHref(m[6]);
      out.push(href ? { t: "link", v: m[6], href } : { t: "text", v: m[6] });
    }
    last = index + m[0].length;
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out;
}

export function extractSuggestions(text: string): { text: string; suggestions: string[] } {
  const match = text.match(SUGGEST);
  if (!match) return { text: text.replace(/<<suggest:[\s\S]*$/i, "").trimEnd(), suggestions: [] };
  const suggestions = match[1]
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= MAX_SUGGESTION_LENGTH)
    .slice(0, MAX_SUGGESTIONS);
  return { text: text.slice(0, match.index).trimEnd(), suggestions };
}

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*\d{1,2}[.)]\s+(.*)$/;
const HEADING = /^\s{0,3}#{1,4}\s+(.*)$/;

/** Parses the small markdown subset the assistant is told to use. Never produces HTML; the renderer builds React nodes from these blocks. */
export function parseChat(raw: string): ParsedChat {
  const { text, suggestions } = extractSuggestions(raw);
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: Inline[][] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", inline: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = line.match(HEADING);
    const bullet = line.match(BULLET);
    const numbered = line.match(NUMBERED);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h", inline: parseInline(heading[1]) });
    } else if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (list && list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push(parseInline((bullet ?? numbered)![1]));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return { blocks, suggestions };
}
