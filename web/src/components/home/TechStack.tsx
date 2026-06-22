import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stack = {
  frontend: ["React", "Next.js", "Angular", "Vue"],
  backend: ["Node.js", "Python", ".NET", "Java"],
  ai: ["Claude", "OpenAI", "Gemini", "Llama", "Mistral"],
  cloud: ["AWS", "Azure", "GCP"],
  data: ["Snowflake", "Databricks", "PostgreSQL", "MongoDB"],
};

export async function TechStack() {
  const t = await getTranslations("Home.techStack");

  return (
    <section className="border-y border-border/60 bg-surface/40 py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(stack).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                {t(`categories.${category}`)}
              </h3>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-cyan/40 hover:text-foreground"
                  >
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
