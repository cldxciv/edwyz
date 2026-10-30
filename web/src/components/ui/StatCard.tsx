"use client";

import { motion } from "framer-motion";

const ACCENT_CONFIGS = [
  { bar: "from-cyan to-electric", glow: "hover:shadow-[0_0_30px_rgba(34,226,245,0.15)]", border: "hover:border-cyan/40" },
  { bar: "from-purple to-indigo", glow: "hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]", border: "hover:border-purple/40" },
  { bar: "from-electric to-cyan", glow: "hover:shadow-[0_0_30px_rgba(37,99,255,0.15)]", border: "hover:border-electric/40" },
  { bar: "from-indigo to-purple", glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]", border: "hover:border-indigo/40" },
];

export function StatCard({
  value,
  label,
  delay = 0,
  index = 0,
}: {
  value: string;
  label: string;
  delay?: number;
  index?: number;
}) {
  const accent = ACCENT_CONFIGS[index % ACCENT_CONFIGS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`group relative flex flex-col rounded-2xl border border-border bg-surface/80 p-5 transition-all duration-300 ${accent.border} ${accent.glow} overflow-hidden`}
    >
      {/* Gradient accent bar at top */}
      <span className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent.bar} opacity-70`} />

      {/* Value */}
      <p className="mt-1 font-display text-2xl font-extrabold leading-tight gradient-text sm:text-3xl">
        {value}
      </p>

      {/* Label */}
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>

      {/* Bottom glow dot */}
      <span className={`absolute bottom-2 right-3 h-1.5 w-1.5 rounded-full bg-gradient-to-br ${accent.bar} opacity-50`} />
    </motion.div>
  );
}
