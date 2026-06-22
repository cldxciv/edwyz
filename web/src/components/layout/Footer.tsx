import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { getServices } from "@/lib/data/services";
import { siteConfig } from "@/lib/nav";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const services = (await getServices()).slice(0, 6);

  return (
    <footer className="border-t border-border/60 bg-surface">
      <Container className="grid gap-10 py-16 lg:grid-cols-4">
        <div>
          <Image
            src="/img/logo-edwyz-light.png"
            alt={siteConfig.name}
            width={160}
            height={51}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <div className="mt-6 flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-xs font-medium text-muted transition-colors hover:text-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{t("services")}</h3>
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-muted hover:text-foreground">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{t("company")}</h3>
          <ul className="mt-4 space-y-3">
            {[
              { label: t("aboutUs"), href: "/about" },
              { label: nav("caseStudies"), href: "/case-studies" },
              { label: nav("blog"), href: "/blog" },
              { label: nav("careers"), href: "/careers" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">{t("getInTouch")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>hello@edwyz.com</li>
            <li>+1 (555) 010-0100</li>
            <li>
              <Link href="/contact" className="text-cyan hover:underline">
                {t("scheduleCta")} &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-border/60 py-6 sm:flex-row">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}. {t("rightsReserved")}
        </p>
        <div className="flex gap-6 text-xs text-muted">
          <Link href="/privacy" className="hover:text-foreground">{t("privacyPolicy")}</Link>
          <Link href="/terms" className="hover:text-foreground">{t("termsOfService")}</Link>
        </div>
      </Container>
    </footer>
  );
}
