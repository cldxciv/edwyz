"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1 text-xs font-medium text-cyan">
            AI &middot; Data &middot; Engineering
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Engineering the <span className="gradient-text">Future</span>{" "}with AI, Data &amp; Innovation
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Edwyz partners with enterprises to design, build, and scale intelligent systems —
            from AI agents to cloud platforms — that turn ambitious ideas into production reality.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">Schedule Consultation</Button>
            <Button href="/services" variant="secondary">Explore Solutions</Button>
            <Button href="/ai-hub" variant="ghost">Talk to AI Assistant &rarr;</Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
