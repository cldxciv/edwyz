import type { ReactNode } from "react";
import { parseChat, type Block, type Inline } from "@/lib/chatMarkdown";

function renderInline(parts: Inline[]): ReactNode[] {
  return parts.map((p, i) => {
    switch (p.t) {
      case "bold":
        return (
          <strong key={i} className="font-semibold text-foreground">
            {p.v}
          </strong>
        );
      case "italic":
        return <em key={i}>{p.v}</em>;
      case "code":
        return (
          <code key={i} className="rounded bg-background/60 px-1 py-0.5 font-mono text-[0.85em] text-cyan">
            {p.v}
          </code>
        );
      case "link": {
        const external = /^https?:/i.test(p.href);
        return (
          <a
            key={i}
            href={p.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-cyan underline decoration-cyan/40 underline-offset-2 transition-colors hover:decoration-cyan"
          >
            {p.v}
          </a>
        );
      }
      default:
        return <span key={i}>{p.v}</span>;
    }
  });
}

function renderBlock(b: Block, i: number): ReactNode {
  switch (b.type) {
    case "h":
      return (
        <p key={i} className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-cyan">
          {renderInline(b.inline)}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="space-y-1.5">
          {b.items.map((item, j) => (
            <li key={j} className="flex gap-2">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-electric to-cyan" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="space-y-1.5">
          {b.items.map((item, j) => (
            <li key={j} className="flex gap-2">
              <span aria-hidden className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[11px] font-semibold text-cyan">
                {j + 1}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    default:
      return <p key={i}>{renderInline(b.inline)}</p>;
  }
}

export function ChatMarkdown({ text }: { text: string }) {
  const { blocks } = parseChat(text);
  return <div className="space-y-2.5">{blocks.map(renderBlock)}</div>;
}
