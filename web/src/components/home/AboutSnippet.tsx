"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { key: "projectsDelivered", value: 240 },
  { key: "clientsServed", value: 95 },
  { key: "countriesReached", value: 18 },
  { key: "teamMembers", value: 150 },
];

function Counter({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold gradient-text sm:text-5xl">
      {display}+
    </span>
  );
}

export function AboutSnippet() {
  const t = useTranslations("Home.aboutSnippet");

  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <Counter value={s.value} />
              <p className="mt-2 text-sm text-muted">{t(`stats.${s.key}`)}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
