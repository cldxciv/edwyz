"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TechIllustration } from "./TechIllustration";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

export function Hero() {
  const t = useTranslations("Home.hero");
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduced) return;
    const timer = window.setTimeout(() => setShowScene(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {showScene && <HeroScene />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1 text-xs font-medium text-cyan">
              {t("eyebrow")}
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-6xl xl:text-7xl">
              {t("titlePrefix")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}{t("titleSuffix")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t("subtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">{t("ctaConsultation")}</Button>
              <Button href="/services" variant="secondary">{t("ctaExplore")}</Button>
              <Button href="/ai-hub" variant="ghost">{t("ctaAi")} &rarr;</Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <TechIllustration />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
