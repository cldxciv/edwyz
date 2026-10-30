"use client";

import { useEffect, useRef } from "react";

export function LoopVideo({
  name,
  label,
  width = 480,
  height = 270,
  className,
}: {
  name: string;
  label: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={`/video/${name}.jpg`}
      width={width}
      height={height}
      aria-label={label}
      className={className}
    >
      <source src={`/video/${name}.webm`} type="video/webm" />
      <source src={`/video/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
