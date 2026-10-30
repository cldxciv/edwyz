import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function ContactCTA() {
  const t = await getTranslations("Home.contactCta");

  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-surface to-surface-2 px-8 py-20 text-center sm:px-16">
          {/* Radial gradient backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(37,99,255,0.22),transparent_65%)]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom-right,rgba(34,226,245,0.12),transparent_55%)]" aria-hidden />

          {/* Animated floating orbs */}
          <div className="pointer-events-none absolute -top-8 left-1/4 h-32 w-32 rounded-full bg-electric/15 blur-2xl animate-glow-pulse" aria-hidden />
          <div className="pointer-events-none absolute -bottom-8 right-1/4 h-24 w-24 rounded-full bg-cyan/15 blur-2xl animate-glow-pulse" aria-hidden style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute top-1/2 left-8 h-16 w-16 rounded-full bg-purple/15 blur-xl animate-glow-pulse" aria-hidden style={{ animationDelay: "0.8s" }} />

          {/* Subtle grid lines */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-10"
            aria-hidden
            style={{
              backgroundImage: `linear-gradient(rgba(34,226,245,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,226,245,0.15) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Animated top-border accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" aria-hidden />

          <div className="relative z-10">
            {/* Badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1 text-xs font-medium text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
              Available for new projects
            </span>

            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">{t("description")}</p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="primary">{t("cta")}</Button>
              <a
                href="mailto:hello@edwyz.com"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                or email hello@edwyz.com →
              </a>
            </div>

            {/* Social proof row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-neon-green" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reply within 1 business day
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-neon-green" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                NDA signing available
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-neon-green" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free discovery call
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
