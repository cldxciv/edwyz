"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-lg transition-all hover:border-cyan/40 hover:text-cyan sm:bottom-6 sm:right-6"
    >
      <ChevronUp size={18} className="text-muted" />
    </button>
  );
}
