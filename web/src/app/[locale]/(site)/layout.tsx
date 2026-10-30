import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeferredWidgets } from "@/components/ui/DeferredWidgets";
import { setRequestLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";

export default async function SiteLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setRequestLocale(locale);
  let whatsappNumber = "";
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "settings" });
    whatsappNumber = (settings as { whatsappNumber?: string }).whatsappNumber ?? "";
  } catch {}

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <DeferredWidgets whatsappNumber={whatsappNumber} />
    </>
  );
}
