"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function AnimatedIconBadge({
  id,
  gradientClassName,
  sizeClassName = "h-14 w-14",
  iconSize = 26,
}: {
  id: string;
  gradientClassName: string;
  sizeClassName?: string;
  iconSize?: number;
}) {
  return (
    <div className={`relative flex items-center justify-center rounded-2xl ${sizeClassName} ${gradientClassName}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: "currentColor", opacity: 0.15 }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <Icon id={id} size={iconSize} />
    </div>
  );
}
