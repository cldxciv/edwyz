import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk, Sora, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/nav";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/seo";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: `${siteConfig.url}/en`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [{ url: `${siteConfig.url}/img/og/edwyz-cover-photo-v2-1200x630.png`, width: 1200, height: 630, alt: "Edwyz — AI & Data Engineering" }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/img/og/edwyz-cover-photo-v2-1200x630.png`],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={siteGraph()} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
