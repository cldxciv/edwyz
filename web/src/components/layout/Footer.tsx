import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/nav";

const footerServices = services.slice(0, 6);

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export function Footer() {
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
          <h3 className="text-sm font-semibold text-foreground">Services</h3>
          <ul className="mt-4 space-y-3">
            {footerServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-muted hover:text-foreground">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-3">
            {[
              { label: "About Us", href: "/about" },
              { label: "Case Studies", href: "/case-studies" },
              { label: "Blog", href: "/blog" },
              { label: "Careers", href: "/careers" },
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
          <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>hello@edwyz.com</li>
            <li>+1 (555) 010-0100</li>
            <li>
              <Link href="/contact" className="text-cyan hover:underline">
                Schedule a consultation &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-border/60 py-6 sm:flex-row">
        <p className="text-xs text-muted">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted">
          <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
        </div>
      </Container>
    </footer>
  );
}
