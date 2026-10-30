type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({ eyebrow, title, description, align = "center", as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{eyebrow}</span>
      )}
      <Tag className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
