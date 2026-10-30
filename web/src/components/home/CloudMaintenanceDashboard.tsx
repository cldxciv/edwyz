"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Server, Shield, HardDrive, DollarSign,
  Zap, Bot, CheckCircle2, AlertTriangle, Activity
} from "lucide-react";

// ─── animated counter ───────────────────────────────────────────────────────
function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 60;
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [to]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

// ─── sparkline SVG ──────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 48 }: { data: number[]; color: string; height?: number }) {
  const w = 200, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── donut gauge ────────────────────────────────────────────────────────────
function DonutGauge({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) {
  const r = size * 0.38, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / max) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <motion.circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${filled} ${circ - filled}` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

// ─── mini bar chart ──────────────────────────────────────────────────────────
function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
          <motion.div
            className="w-full rounded-sm"
            style={{ backgroundColor: color, opacity: 0.7 + 0.3 * (d.value / max) }}
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 44}px` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
          />
          <span className="text-[9px] text-[#9aa3b2]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CPU data (simulate live) ────────────────────────────────────────────────
const CPU_BASE = [38,42,45,41,55,62,48,44,40,38,42,46,50,44,42,38,41,45,42,40];
const MEM_BASE = [58,60,62,61,65,68,64,62,60,59,61,63,66,64,61,60,62,64,62,61];

export function CloudMaintenanceDashboard() {
  const [cpuData, setCpuData] = useState(CPU_BASE);
  const [memData, setMemData] = useState(MEM_BASE);
  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClock(fmt());
    const id = setInterval(() => setClock(fmt()), 30000);
    return () => clearInterval(id);
  }, []);

  // Simulate live metric updates
  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      setTick(tickRef.current);
      setCpuData(prev => [...prev.slice(1), Math.max(20, Math.min(85, prev[prev.length - 1] + (Math.random() * 10 - 5)))]);
      setMemData(prev => [...prev.slice(1), Math.max(45, Math.min(80, prev[prev.length - 1] + (Math.random() * 6 - 3)))]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const cpuNow = Math.round(cpuData[cpuData.length - 1]);
  const memNow = Math.round(memData[memData.length - 1]);

  return (
    <div className="select-none rounded-2xl border border-border bg-[#0a0d14] p-5 font-mono text-[11px]">

      {/* ── Header ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          <span className="font-sans text-xs font-semibold text-[#f5f7fa]">Edwyz Cloud Operations Center</span>
        </div>
        <span className="text-[#9aa3b2]">{clock || " "}</span>
      </div>

      {/* ── Top KPI row ── */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[
          { icon: Activity, label: "Uptime", value: "99.99%", sub: "+0.02%", color: "#22e2f5", good: true },
          { icon: Server, label: "Instances", value: "32", sub: "Running", color: "#22e2f5", good: true },
          { icon: Zap, label: "CPU Usage", value: `${cpuNow}%`, sub: "Average", color: cpuNow > 70 ? "#f97316" : "#22e2f5", good: cpuNow <= 70 },
          { icon: HardDrive, label: "Memory", value: `${memNow}%`, sub: "Average", color: memNow > 75 ? "#f97316" : "#a78bfa", good: memNow <= 75 },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <kpi.icon size={10} style={{ color: kpi.color }} />
              <span className="text-[#9aa3b2]">{kpi.label}</span>
            </div>
            <p className="font-sans text-base font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[#9aa3b2]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-3 gap-3 mb-3">

        {/* CPU Chart */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-1 font-sans text-[10px] font-semibold text-[#f5f7fa]">CPU Utilization</p>
          <Sparkline data={cpuData} color="#22e2f5" height={44} />
          <div className="mt-1 flex justify-between text-[#9aa3b2]">
            <span>0%</span><span>100%</span>
          </div>
          <div className="mt-2 space-y-1">
            {[
              { label: "High CPU", color: "#ef4444" },
              { label: "High Disk", color: "#f97316" },
              { label: "DB Connections", color: "#f97316" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <AlertTriangle size={9} style={{ color: a.color }} />
                <span style={{ color: a.color }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security panel */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-2 font-sans text-[10px] font-semibold text-[#f5f7fa]">Security & Patch Management</p>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <DonutGauge value={92} max={100} color="#22c55e" size={56} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-sans text-sm font-bold text-green-400">92</span>
                <span className="text-[#9aa3b2] leading-none">/100</span>
              </div>
            </div>
            <div>
              <p className="text-green-400 font-sans font-semibold">Excellent</p>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
                {[
                  { label: "Critical", val: "2", color: "#ef4444" },
                  { label: "High", val: "5", color: "#f97316" },
                  { label: "Medium", val: "12", color: "#eab308" },
                  { label: "Low", val: "8", color: "#22c55e" },
                ].map(v => (
                  <div key={v.label} className="flex gap-1">
                    <span style={{ color: v.color }} className="font-bold">{v.val}</span>
                    <span className="text-[#9aa3b2]">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            {["Linux Kernel", "OpenSSL", "Docker", "Amazon Linux 2"].map((pkg, i) => (
              <div key={pkg} className="flex items-center justify-between">
                <span className="text-[#9aa3b2]">{pkg}</span>
                <span className="text-green-400 flex items-center gap-0.5"><CheckCircle2 size={8} /> Installed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Backup panel */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-2 font-sans text-[10px] font-semibold text-[#f5f7fa]">Backup & Disaster Recovery</p>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <DonutGauge value={100} max={100} color="#22c55e" size={56} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-sans text-sm font-bold text-green-400">100%</span>
              </div>
            </div>
            <div className="text-[10px] space-y-0.5">
              {[
                { label: "Successful", val: "128", color: "#22c55e" },
                { label: "Failed", val: "0", color: "#ef4444" },
                { label: "Skipped", val: "0", color: "#6b7280" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[#9aa3b2]">{s.label}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2">
            <div><p className="text-[#9aa3b2]">RTO</p><p className="font-sans font-bold text-cyan-400">2 hrs</p></div>
            <div><p className="text-[#9aa3b2]">RPO</p><p className="font-sans font-bold text-cyan-400">15 min</p></div>
            <div><p className="text-[#9aa3b2]">DR Status</p><p className="text-green-400 font-sans font-bold">Ready</p></div>
          </div>
        </div>
      </div>

      {/* ── Bottom 3-col grid ── */}
      <div className="grid grid-cols-3 gap-3">

        {/* Cost */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign size={10} className="text-cyan-400" />
            <p className="font-sans text-[10px] font-semibold text-[#f5f7fa]">Cost Optimization</p>
          </div>
          <p className="font-sans text-lg font-bold text-cyan-400">$18,560<span className="text-sm font-normal text-[#9aa3b2]">/mo</span></p>
          <p className="text-green-400 mb-2">↓ 12.4% vs last month</p>
          <BarChart
            data={[
              { label: "Jan", value: 22000 },
              { label: "Feb", value: 20500 },
              { label: "Mar", value: 21000 },
              { label: "Apr", value: 19800 },
              { label: "May", value: 18560 },
            ]}
            color="#22e2f5"
          />
          <div className="mt-2 pt-1.5 border-t border-white/5">
            <div className="flex justify-between"><span className="text-[#9aa3b2]">Estimated savings</span><span className="text-green-400 font-bold">$6,370/mo</span></div>
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity size={10} className="text-purple-400" />
            <p className="font-sans text-[10px] font-semibold text-[#f5f7fa]">Performance Optimization</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { label: "Response", val: "320ms", good: true },
              { label: "Throughput", val: "1,250 rps", good: true },
              { label: "Error Rate", val: "0.12%", good: true },
              { label: "Availability", val: "99.98%", good: true },
            ].map(m => (
              <div key={m.label} className="rounded-lg bg-white/[0.02] px-2 py-1">
                <p className="text-[#9aa3b2]">{m.label}</p>
                <p className="font-sans font-bold text-cyan-400">{m.val}</p>
              </div>
            ))}
          </div>
          <Sparkline data={MEM_BASE.map(v => v * 5)} color="#a78bfa" height={28} />
        </div>

        {/* Automation */}
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Bot size={10} className="text-cyan-400" />
            <p className="font-sans text-[10px] font-semibold text-[#f5f7fa]">Cloud Automation</p>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[
              { label: "Workflows", val: "48" },
              { label: "Runs", val: "1,248" },
              { label: "Success", val: "98.6%" },
            ].map(m => (
              <div key={m.label} className="rounded-lg bg-white/[0.02] p-1.5 text-center">
                <p className="font-sans font-bold text-cyan-400">{m.val}</p>
                <p className="text-[#9aa3b2] leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            {[
              "Log Rotation",
              "Backup Verification",
              "Certificate Renewal",
              "Security Scan",
            ].map((task) => (
              <div key={task} className="flex items-center gap-1.5">
                <CheckCircle2 size={9} className="text-green-400 flex-shrink-0" />
                <span className="text-[#9aa3b2]">{task}</span>
                <span className="ml-auto text-green-400">✓</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Footer badges ── */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-white/5 pt-3">
        {[
          { icon: Shield, label: "Proactive Monitoring" },
          { icon: Shield, label: "Enhanced Security" },
          { icon: Activity, label: "Optimized Performance" },
          { icon: DollarSign, label: "Cost Savings" },
          { icon: Server, label: "High Availability" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[#9aa3b2]">
            <Icon size={10} className="text-cyan-400" />
            <span>{label}</span>
          </div>
        ))}
        <div className="ml-auto font-sans text-[10px] text-cyan-400 font-semibold">edwyz.com</div>
      </div>
    </div>
  );
}
