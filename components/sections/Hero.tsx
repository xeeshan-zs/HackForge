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
      <div className="hero-particles" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[var(--color-bg)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
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
          className="mt-3 text-xl text-zinc-200 md:text-2xl"
        >
          Forge Your Future
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
              className="card-surface min-w-24 rounded-md bg-[var(--color-surface-2)] px-4 py-3"
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
            Register Now
          </a>
          <a href="#categories" className="secondary-btn">
            View Categories
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
