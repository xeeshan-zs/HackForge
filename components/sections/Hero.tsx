"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

const countdownItems = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export default function Hero() {
  const count = useCountdown("2026-10-10T09:00:00+05:00");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24">
      <div className="hero-particles" aria-hidden="true" />
      <div className="tech-grid-overlay opacity-70" aria-hidden="true" />
      <div className="tech-orb left-[8%] top-[20%] h-36 w-36 bg-cyan-400/25" aria-hidden="true" />
      <div
        className="tech-orb right-[10%] top-[16%] h-44 w-44 bg-orange-500/25 [animation-delay:1.4s]"
        aria-hidden="true"
      />
      <div
        className="tech-orb bottom-[16%] left-[26%] h-24 w-24 bg-violet-400/25 [animation-delay:2.1s]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[var(--color-bg)]"
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cyan-100"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          Future-Ready Build Sprint
        </motion.div>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mb-3 text-xs uppercase tracking-[0.34em] text-[var(--color-muted)]"
        >
          ACM Chapter NUML Lahore Presents
        </motion.p>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gold)] bg-clip-text text-6xl font-extrabold text-transparent md:text-8xl"
        >
          HackForge
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mt-3 max-w-2xl text-xl text-zinc-200 md:text-2xl"
        >
          Forge Your Future with Pakistan’s most electric student hack showdown.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm">
            Oct 10, 2026
          </span>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm">
            NUML Lahore Campus
          </span>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {countdownItems.map(({ key, label }) => (
            <div
              key={key}
              className="card-surface min-w-24 rounded-xl bg-[var(--color-surface-2)] px-4 py-3 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="font-display text-2xl font-bold md:text-3xl">
                {String(count[key]).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <a href="#register" className="primary-btn">
            Launch Registration
          </a>
          <a href="#categories" className="secondary-btn">
            Explore Tracks
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
