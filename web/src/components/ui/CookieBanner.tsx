"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  const accept = (all: boolean) => {
    localStorage.setItem("cookie-consent", all ? "all" : "necessary");
    setVisible(false);
    if (all && typeof window !== "undefined") {
      (window as { gtag?: (...args: unknown[]) => void }).gtag?.(
        "consent",
        "update",
        { analytics_storage: "granted", ad_storage: "granted" },
      );
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 shadow-2xl backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          We use cookies to improve your experience and analyse traffic.{" "}
          <Link href="/privacy" className="text-cyan hover:underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => accept(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-cyan/40 hover:text-foreground"
          >
            Necessary Only
          </button>
          <button
            onClick={() => accept(true)}
            className="rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            Accept All
          </button>
          <button
            onClick={() => accept(false)}
            aria-label="Dismiss"
            className="ml-1 text-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
