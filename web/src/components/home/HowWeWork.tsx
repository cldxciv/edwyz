"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    key: "discover",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden>
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="28" r="6" stroke="#f97316" strokeWidth="2" />
        <line x1="16" y1="28" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="11" y="28" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="23" y="28" width="10" height="6" rx="1" stroke="#f97316" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: "02",
    key: "build",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden>
        <rect x="6" y="8" width="28" height="4" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="6" y="8" width="28" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="16" width="20" height="4" rx="2" fill="#f97316" opacity="0.2" />
        <rect x="6" y="16" width="20" height="4" rx="2" stroke="#f97316" strokeWidth="1.5" />
        <rect x="6" y="24" width="24" height="4" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="6" y="24" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="32" width="14" height="4" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="6" y="32" width="14" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: "03",
    key: "deploy",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" aria-hidden>
        <path d="M10 26 Q20 10 30 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="26" r="4" stroke="#f97316" strokeWidth="2" />
        <circle cx="35" cy="30" r="3" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="25" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="26" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

export function HowWeWork() {
  const t = useTranslations("Home.howWeWork");

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* dotted connector lines — desktop only */}
          <div className="pointer-events-none absolute inset-x-0 top-[52px] hidden md:block" aria-hidden>
            <div className="mx-auto flex h-0 items-center justify-between px-[calc(100%/6)]">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex-1 border-t-2 border-dashed border-border mx-4"
                />
              ))}
            </div>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex flex-col rounded-2xl border border-border bg-surface p-6"
            >
              {/* number badge */}
              <span className="mb-4 inline-flex h-7 w-10 items-center justify-center rounded-full bg-surface-2 text-xs font-bold tracking-widest text-muted">
                {step.number}
              </span>

              {/* icon */}
              <div className="mb-4 text-foreground/70">{step.icon}</div>

              <h3 className="font-heading text-lg font-semibold text-foreground">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`steps.${step.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
