"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Required by next-themes: resolvedTheme is undefined on the server and on first
  // client render, so rendering it directly causes a hydration mismatch. The "mounted"
  // flag delays theme-dependent rendering until after hydration completes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-5 w-5" aria-hidden />;
  }

  const isLight = resolvedTheme === "light";

  return (
    <button
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="flex items-center text-muted transition-colors hover:text-foreground"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
