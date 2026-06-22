"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <Globe size={16} />
        {locale.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-border bg-surface py-1 shadow-xl">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: loc });
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface-2 ${
                loc === locale ? "text-cyan" : "text-foreground"
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
