'use client';

import { useEffect, useRef, useState } from "react";

export default function CalendlyEmbed({ url }: { url: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const existing = document.getElementById("calendly-script");
        if (existing) { setLoaded(true); return; }

        const script = document.createElement("script");
        script.id = "calendly-script";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ minWidth: "320px", minHeight: "700px" }}>
      {loaded && (
        <div
          className="calendly-inline-widget"
          data-url={url}
          style={{ minWidth: "320px", height: "700px" }}
        />
      )}
      {!loaded && (
        <div className="flex h-[700px] items-center justify-center rounded-2xl border border-border bg-surface">
          <p className="text-sm text-muted">Loading scheduler…</p>
        </div>
      )}
    </div>
  );
}
