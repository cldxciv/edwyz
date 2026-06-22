import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stack = {
  Frontend: ["React", "Next.js", "Angular", "Vue"],
  Backend: ["Node.js", "Python", ".NET", "Java"],
  AI: ["Claude", "OpenAI", "Gemini", "Llama", "Mistral"],
  Cloud: ["AWS", "Azure", "GCP"],
  Data: ["Snowflake", "Databricks", "PostgreSQL", "MongoDB"],
};

export function TechStack() {
  return (
    <section className="border-y border-border/60 bg-surface/40 py-24">
      <Container>
        <SectionHeading eyebrow="Technology" title="A modern, battle-tested technology stack" />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(stack).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{category}</h3>
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
