"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/nav";

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // See ThemeToggle.tsx — avoids a hydration mismatch from branching on resolvedTheme
  // before the client has resolved the actual theme.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "light"
    ? "/img/logo-edwyz-transparent.png"
    : "/img/logo-edwyz-light.png";

  return (
    <Image
      src={src}
      alt={siteConfig.name}
      width={160}
      height={51}
      className={className}
      priority
    />
  );
}
