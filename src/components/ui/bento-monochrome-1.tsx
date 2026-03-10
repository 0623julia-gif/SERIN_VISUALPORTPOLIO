import React, { useEffect, useMemo, useRef, useState } from "react";

import { Trash2 } from "lucide-react";

const STYLE_ID = "bento3-animations";

const palettes = {
  dark: {
    surface: "bg-transparent text-neutral-100",
    heading: "text-white",
    muted: "text-neutral-400",
    capsule: "bg-white/5 border-white/10 text-white/80",
    card: "bg-white/5 backdrop-blur-xl",
    cardBorder: "border-white/10",
    metric: "bg-white/5 backdrop-blur-xl border-white/10 text-white/70",
    headingAccent: "bg-white/10",
    toggleSurface: "bg-white/10",
    toggle: "border-white/15 text-white",
    button: "border-white/15 text-white hover:border-white/40 hover:bg-white/10",
    gridColor: "rgba(255, 255, 255, 0.06)",
    overlay:
      "linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 45%, rgba(10,10,10,0.92) 100%)",
    focusGlow: "rgba(255, 255, 255, 0.14)",
    iconStroke: "#f8fafc",
    iconTrail: "rgba(148, 163, 184, 0.55)",
  },
  light: {
    surface: "bg-slate-100 text-neutral-900",
    heading: "text-neutral-900",
    muted: "text-neutral-600",
    capsule: "bg-white/70 border-neutral-200 text-neutral-700",
    card: "bg-white/80",
    cardBorder: "border-neutral-200",
    metric: "bg-white border-neutral-200 text-neutral-600",
    headingAccent: "bg-neutral-900/10",
    toggleSurface: "bg-white",
    toggle: "border-neutral-300 text-neutral-900",
    button: "border-neutral-300 text-neutral-900 hover:border-neutral-500 hover:bg-neutral-900/5",
    gridColor: "rgba(17, 17, 17, 0.08)",
    overlay:
      "linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(241,245,249,0.68) 45%, rgba(248,250,252,0.96) 100%)",
    focusGlow: "rgba(15, 23, 42, 0.15)",
    iconStroke: "#111827",
    iconTrail: "rgba(30, 41, 59, 0.42)",
  },
};

const getRootTheme = () => {
  if (typeof document === "undefined") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.dataset?.theme === "dark" || root.getAttribute("data-theme") === "dark") return "dark";
  if (root.classList.contains("light")) return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

export function Bento3Section({ posts = [] }: { posts?: any[] }) {
  const [introReady, setIntroReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes bento3-card-in {
        0% { opacity: 0; transform: translate3d(0, 28px, 0) scale(0.97); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes bento3-flare {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes bento3-dash {
        0% { transform: translateX(-25%); opacity: 0; }
        30% { opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translateX(25%); opacity: 0; }
      }
      @keyframes bento3-wave {
        0% { transform: translateX(-45%); }
        100% { transform: translateX(45%); }
      }
      @keyframes bento3-pulse {
        0% { transform: scale(0.8); opacity: 0.6; }
        70% { opacity: 0.05; }
        100% { transform: scale(1.35); opacity: 0; }
      }
      .bento3-root {
        padding-inline: 0;
        width: 100%;
      }
      .bento3-section {
        gap: clamp(4rem, 8vw, 6rem);
        padding-inline: 0;
        width: 100%;
      }
      .bento3-grid {
        gap: clamp(1.25rem, 4vw, 2.5rem);
      }
      .bento3-metrics {
        gap: clamp(1rem, 3vw, 1.5rem);
        padding: clamp(1.25rem, 4vw, 2.5rem);
      }
      .bento3-footer {
        gap: clamp(1.15rem, 3.5vw, 2.4rem);
      }
      .bento3-hero-pill {
        flex-wrap: wrap;
      }
      .bento3-hero-pill span:last-child {
        flex-shrink: 0;
      }
      .bento3-card {
        opacity: 0;
        transform: translate3d(0, 32px, 0);
        filter: blur(14px);
        transition: border-color 400ms ease, background 400ms ease, padding 300ms ease;
        padding: clamp(2rem, 5vw, 4rem);
        border-radius: clamp(1.5rem, 4vw, 28px);
      }
      .bento3-card[data-visible="true"] {
        animation: bento3-card-in 760ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
        animation-delay: var(--bento3-delay, 0ms);
      }
      .bento3-icon {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: clamp(2.75rem, 6vw, 3.25rem);
        width: clamp(2.75rem, 6vw, 3.25rem);
        border-radius: 9999px;
        overflow: hidden;
        isolation: isolate;
      }
      .bento3-icon::before,
      .bento3-icon::after {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: inherit;
        border: 1px solid var(--bento3-icon-trail);
        opacity: 0.45;
      }
      .bento3-icon::after {
        inset: 10px;
        opacity: 0.2;
      }
      .bento3-icon[data-variant="orbit"] span {
        position: absolute;
        height: 140%;
        width: 3px;
        background: linear-gradient(180deg, transparent, var(--bento3-icon-stroke) 55%, transparent);
        transform-origin: center;
        animation: bento3-flare 8s linear infinite;
      }
      .bento3-icon[data-variant="relay"] span {
        position: absolute;
        inset: 18px;
        border-top: 1px solid var(--bento3-icon-stroke);
        border-bottom: 1px solid var(--bento3-icon-stroke);
        transform: skewX(-15deg);
      }
      .bento3-icon[data-variant="relay"] span::before,
      .bento3-icon[data-variant="relay"] span::after {
        content: "";
        position: absolute;
        height: 1px;
        width: 120%;
        left: -10%;
        background: linear-gradient(90deg, transparent, var(--bento3-icon-stroke), transparent);
        animation: bento3-dash 2.6s ease-in-out infinite;
      }
      .bento3-icon[data-variant="relay"] span::after {
        top: 70%;
        animation-delay: 0.9s;
      }
      .bento3-icon[data-variant="wave"] span {
        position: absolute;
        inset: 12px;
        border-radius: 999px;
        overflow: hidden;
      }
      .bento3-icon[data-variant="wave"] span::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 5%, var(--bento3-icon-stroke) 50%, transparent 95%);
        transform: translateX(-45%);
        animation: bento3-wave 2.8s ease-in-out infinite alternate;
      }
      .bento3-icon[data-variant="spark"] span {
        position: absolute;
        inset: 0;
      }
      .bento3-icon[data-variant="spark"] span::before,
      .bento3-icon[data-variant="spark"] span::after {
        content: "";
        position: absolute;
        inset: 12px;
        border-radius: 9999px;
        border: 1px solid var(--bento3-icon-stroke);
        opacity: 0.28;
        animation: bento3-pulse 2.8s ease-out infinite;
      }
      .bento3-icon[data-variant="spark"] span::after {
        animation-delay: 0.9s;
      }
      .bento3-icon[data-variant="loop"] span {
        position: absolute;
        inset: 12px;
      }
      .bento3-icon[data-variant="loop"] span::before,
      .bento3-icon[data-variant="loop"] span::after {
        content: "";
        position: absolute;
        height: 1px;
        width: 100%;
        top: 50%;
        left: 0;
        background: linear-gradient(90deg, transparent, var(--bento3-icon-stroke), transparent);
      }
      .bento3-icon[data-variant="loop"] span::before {
        transform: rotate(90deg);
      }
      .bento3-icon[data-variant="loop"] span::after {
        opacity: 0.4;
        transform: rotate(0deg);
      }
      @media (max-width: 1024px) {
        .bento3-section {
          gap: clamp(2.5rem, 6vw, 4rem);
          padding-inline: clamp(1.1rem, 6vw, 3rem);
        }
        .bento3-metrics {
          border-radius: 24px;
        }
      }
      @media (max-width: 768px) {
        .bento3-root { min-height: auto; }
        .bento3-section {
          gap: clamp(2rem, 7vw, 3.5rem);
          padding-inline: clamp(1rem, 8vw, 2.25rem);
          padding-block: clamp(3rem, 10vw, 4rem);
        }
        .bento3-card {
          padding: clamp(1rem, 5vw, 1.6rem);
          border-radius: 22px;
        }
        .bento3-grid { gap: clamp(1rem, 6vw, 2rem); }
        .bento3-metrics {
          padding: clamp(1rem, 6vw, 1.8rem);
          gap: clamp(0.75rem, 4vw, 1.25rem);
        }
        .bento3-footer { gap: clamp(1rem, 6vw, 1.75rem); }
      }
      @media (max-width: 640px) {
        .bento3-section { gap: clamp(1.75rem, 8vw, 3rem); }
        .bento3-hero-pill { justify-content: center; text-align: center; }
        .bento3-hero-pill span:last-child { width: 100%; text-align: center; }
        .bento3-card { padding: clamp(0.85rem, 6vw, 1.4rem); }
        .bento3-icon {
          height: clamp(2.25rem, 8vw, 2.75rem);
          width: clamp(2.25rem, 8vw, 2.75rem);
        }
        .bento3-metrics div { padding-block: clamp(1rem, 6vw, 1.5rem); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      setVisible(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!introReady || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [introReady]);

  const p = palettes.dark;

  return (
    <div
      className={`bento3-root w-full flex flex-col justify-center font-sans selection:bg-white/20 ${p.surface}`}
      style={
        {
          "--bento3-grid-color": p.gridColor,
          "--bento3-overlay": p.overlay,
          "--bento3-focus-glow": p.focusGlow,
          "--bento3-icon-stroke": p.iconStroke,
          "--bento3-icon-trail": p.iconTrail,
        } as React.CSSProperties
      }
    >
      <section
        ref={sectionRef}
        className="bento3-section relative flex flex-col"
        style={{ opacity: introReady ? 1 : 0, transition: "opacity 800ms ease" }}
      >
        <div className="bento3-grid grid grid-cols-1 md:grid-cols-12 md:grid-rows-2">
          {posts.map((flow, i) => (
            <div
              key={flow.id}
              data-visible={visible}
              className={`bento3-card group relative flex flex-col justify-between border overflow-hidden ${
                p.card
              } ${p.cardBorder} ${
                i % 5 === 0 ? "md:col-span-7" : i % 5 === 1 ? "md:col-span-5" : i % 5 === 2 ? "md:col-span-12" : i % 5 === 3 ? "md:col-span-6" : "md:col-span-6"
              }`}
              style={{ "--bento3-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              {flow.mainImage && (
                <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <img src={flow.mainImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="bento3-icon" data-variant={flow.variant}>
                    <span />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      flow.onDelete?.();
                    }}
                    className="p-2 glass rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.capsule}`}
                    >
                      {flow.meta}
                    </span>
                  </div>
                  <h3 className={`text-xl font-black tracking-tight uppercase ${p.heading}`}>
                    {flow.title}
                  </h3>
                  <p className={`text-[13px] leading-relaxed max-w-md opacity-60 ${p.muted}`}>
                    {flow.description}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-30">
                    {flow.statLabel}
                  </div>
                  <div className="text-2xl font-black tracking-tighter uppercase tabular-nums">
                    {flow.statValue}
                  </div>
                </div>
                <button
                  onClick={() => flow.onDetail?.(flow)}
                  className={`px-4 py-2 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${p.button}`}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
