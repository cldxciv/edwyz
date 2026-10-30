import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "de"],
  defaultLocale: "en",
  localePrefix: "always",
  alternateLinks: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];
