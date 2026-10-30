"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget").then((m) => m.ChatWidget), { ssr: false });
const BackToTop = dynamic(() => import("@/components/ui/BackToTop").then((m) => m.BackToTop), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/ui/CookieBanner").then((m) => m.CookieBanner), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton").then((m) => m.WhatsAppButton), {
  ssr: false,
});

export function DeferredWidgets({ whatsappNumber }: { whatsappNumber: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <>
      <ChatWidget />
      <BackToTop />
      <CookieBanner />
      {whatsappNumber && <WhatsAppButton number={whatsappNumber} />}
    </>
  );
}
