import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stack: Record<string, { items: string[]; color: string; accent: string }> = {
  frontend: {
    items: ["React", "Next.js", "Angular", "Vue"],
    color: "from-cyan/15 to-electric/10",
    accent: "text-cyan border-cyan/30",
  },
  backend: {
    items: ["Node.js", "Python", ".NET", "Java"],
    color: "from-neon-green/10 to-cyan/5",
    accent: "text-neon-green border-neon-green/30",
  },
  ai: {
    items: ["Claude", "OpenAI", "Gemini", "Llama", "Mistral"],
    color: "from-purple/15 to-indigo/10",
    accent: "text-purple border-purple/30",
  },
  cloud: {
    items: ["AWS", "Azure", "GCP"],
    color: "from-electric/15 to-purple/10",
    accent: "text-electric border-electric/30",
  },
  data: {
    items: ["Snowflake", "Databricks", "PostgreSQL", "MongoDB"],
    color: "from-indigo/15 to-purple/10",
    accent: "text-indigo border-indigo/30",
  },
};

export async function TechStack() {
  const t = await getTranslations("Home.techStack");

  return (
    <section className="relative border-y border-border/60 py-24 overflow-hidden">
      {/* Subtle animated background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-surface/40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,226,245,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,226,245,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(stack).map(([category, { items, color, accent }]) => (
            <div
              key={category}
              className={`group relative rounded-2xl border border-border bg-gradient-to-b ${color} p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(34,226,245,0.07)]`}
            >
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent.split(" ")[0]}`}>
                {t(`categories.${category}`)}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2 rounded-lg border bg-surface/70 px-3 py-2 text-sm text-muted transition-all duration-200 hover:text-foreground ${accent} opacity-90`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${accent.split(" ")[0].replace("text-", "bg-")} opacity-70`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
