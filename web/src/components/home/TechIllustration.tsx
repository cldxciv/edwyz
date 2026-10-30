"use client";

/* Pure CSS / SVG animated tech illustration — zero runtime cost */
export function TechIllustration() {
  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Background glow blob */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-gradient-to-br from-electric/20 to-cyan/10 blur-3xl animate-glow-pulse" />
      </div>

      {/* Neural network SVG */}
      <svg
        viewBox="0 0 440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full"
      >
        <defs>
          <linearGradient id="lgrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22e2f5" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22e2f5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22e2f5" stopOpacity="0" />
          </radialGradient>
          <filter id="gf" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* ── Connection lines ─────────────────────────── */}
        {/* Input → H1 */}
        {[120, 200, 280].map((y1) =>
          [100, 180, 260, 340].map((y2) => (
            <line key={`i-${y1}-${y2}`} x1="85" y1={y1} x2="195" y2={y2}
              stroke="#2563ff" strokeWidth="0.6" strokeOpacity="0.25" />
          ))
        )}
        {/* H1 → H2 */}
        {[100, 180, 260, 340].map((y1) =>
          [140, 220, 300].map((y2) => (
            <line key={`h1-${y1}-${y2}`} x1="205" y1={y1} x2="295" y2={y2}
              stroke="#22e2f5" strokeWidth="0.6" strokeOpacity="0.25" />
          ))
        )}
        {/* H2 → Output */}
        {[140, 220, 300].map((y1) => (
          <line key={`h2-${y1}`} x1="305" y1={y1} x2="375" y2={200}
            stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.4" />
        ))}

        {/* ── Input nodes ──────────────────────────────── */}
        {[120, 200, 280].map((y, i) => (
          <g key={`in-${y}`}>
            <circle cx="76" cy={y} r="14" fill="url(#nodeGlow)" filter="url(#gf)" />
            <circle cx="76" cy={y} r="9" fill="#111" stroke="#2563ff" strokeWidth="1.5">
              <animate attributeName="r" values="9;11;9" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Hidden layer 1 ───────────────────────────── */}
        {[100, 180, 260, 340].map((y, i) => (
          <g key={`h1-${y}`}>
            <circle cx="200" cy={y} r="12" fill="#111" stroke="#22e2f5" strokeWidth="2">
              <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Hidden layer 2 ───────────────────────────── */}
        {[140, 220, 300].map((y, i) => (
          <g key={`h2-${y}`}>
            <circle cx="300" cy={y} r="12" fill="#111" stroke="#7c3aed" strokeWidth="2">
              <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Output node ──────────────────────────────── */}
        <circle cx="376" cy={200} r="16" fill="url(#lgrad)" />
        <circle cx="376" cy={200} r="22" fill="none" stroke="url(#lgrad)" strokeWidth="1" strokeOpacity="0.4">
          <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ── Animated data flow dots ───────────────────── */}
        {[
          { path: "M85,120 L195,100", dur: "1.8s", color: "#22e2f5" },
          { path: "M85,200 L195,180", dur: "2.2s", color: "#22e2f5" },
          { path: "M85,280 L195,260", dur: "2s", color: "#22e2f5" },
          { path: "M205,180 L295,220", dur: "1.6s", color: "#7c3aed" },
          { path: "M205,260 L295,300", dur: "2.4s", color: "#7c3aed" },
          { path: "M305,220 L370,200", dur: "1.4s", color: "#22e2f5" },
        ].map(({ path, dur, color }, i) => (
          <circle key={i} r="3" fill={color} opacity="0.9">
            <animateMotion dur={dur} repeatCount="indefinite" path={path}
              begin={`${i * 0.4}s`} />
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur={dur}
              repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </circle>
        ))}

        {/* ── Layer labels ─────────────────────────────── */}
        <text x="66" y="320" textAnchor="middle" fill="#9aa3b2" fontSize="9" fontFamily="monospace">Input</text>
        <text x="200" y="370" textAnchor="middle" fill="#9aa3b2" fontSize="9" fontFamily="monospace">Hidden</text>
        <text x="300" y="330" textAnchor="middle" fill="#9aa3b2" fontSize="9" fontFamily="monospace">Layers</text>
        <text x="376" y="228" textAnchor="middle" fill="#22e2f5" fontSize="9" fontFamily="monospace">Output</text>
      </svg>

      {/* ── Floating tech badges ──────────────────────── */}
      <div className="absolute top-4 right-0 flex items-center gap-2 rounded-lg border border-cyan/25 bg-surface/90 px-3 py-1.5 backdrop-blur-sm text-xs font-mono text-cyan animate-float shadow-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-green" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
        Python · PyTorch
      </div>
      <div className="absolute top-20 left-0 flex items-center gap-2 rounded-lg border border-purple/25 bg-surface/90 px-3 py-1.5 backdrop-blur-sm text-xs font-mono text-purple animate-float shadow-lg" style={{ animationDelay: "1.2s" }}>
        <span className="h-1.5 w-1.5 rounded-full bg-purple" style={{ animation: "pulse 1.5s 0.5s ease-in-out infinite" }} />
        LLMs · RAG
      </div>
      <div className="absolute bottom-12 right-4 flex items-center gap-2 rounded-lg border border-electric/25 bg-surface/90 px-3 py-1.5 backdrop-blur-sm text-xs font-mono" style={{ color: "var(--electric-blue)", animation: "float 4s 0.6s ease-in-out infinite" }}>
        <span className="h-1.5 w-1.5 rounded-full bg-electric" style={{ animation: "pulse 1.5s 0.75s ease-in-out infinite" }} />
        AWS · GCP · Azure
      </div>
    </div>
  );
}
