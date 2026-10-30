"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";
import clsx from "clsx";

const CloudMaintenanceDashboard = dynamic(() =>
  import("./CloudMaintenanceDashboard").then((m) => m.CloudMaintenanceDashboard),
);

const TABS = [
  { key: "cloud1", type: "interactive" as const },
  {
    key: "cloud2",
    type: "image" as const,
    src: "/img/work-sample-cloud-ops.png",
    alt: "Cloud Operations — work sample dashboard",
  },
  {
    key: "llm",
    type: "image" as const,
    src: "/img/work-sample-llm-solutions.png",
    alt: "LLM Solutions — work sample showcase",
  },
];

export function WorkSamples() {
  const t = useTranslations("Home.workSamples");
  const [active, setActive] = useState(0);

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12">
          {/* Tab bar */}
          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => setActive(idx)}
                className={clsx(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                  active === idx
                    ? "border-cyan bg-cyan/10 text-cyan"
                    : "border-border text-muted hover:border-border/80 hover:text-foreground",
                )}
              >
                {t(`tabs.${tab.key}`)}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {TABS[active].type === "interactive" ? (
                  <CloudMaintenanceDashboard />
                ) : (
                  <Image
                    src={(TABS[active] as { src: string }).src}
                    alt={(TABS[active] as { alt: string }).alt}
                    width={1400}
                    height={900}
                    sizes="(min-width: 1024px) 896px, 100vw"
                    loading="lazy"
                    className="w-full object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Company presentation download card */}
        <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-8 sm:flex-row">
          {/* Cover thumbnail */}
          <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-border shadow-md">
            <Image
              src="/img/edwyz-cover-photo-v2.png"
              alt="Edwyz company presentation cover"
              fill
              sizes="176px"
              loading="lazy"
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
              <FileText size={16} className="text-cyan" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan">
                {t("presentation.badge")}
              </span>
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground">
              {t("presentation.title")}
            </h3>
            <p className="mt-1 text-sm text-muted">{t("presentation.description")}</p>
          </div>

          <a
            href="/Edwyz_Client_Presentation.pptx"
            download
            className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-electric to-cyan px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Download size={15} />
            {t("presentation.download")}
          </a>
        </div>
      </Container>
    </section>
  );
}
