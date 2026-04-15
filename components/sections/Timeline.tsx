"use client";

import { schedule } from "@/data/schedule";
import { motion } from "framer-motion";

export default function Timeline() {
  return (
    <section id="timeline" className="section-container">
      <p className="section-heading">Day Plan</p>
      <h2 className="section-title">Event Timeline</h2>
      <div className="mt-2 h-1 w-20 rounded-full bg-[var(--color-primary)]" />

      <div className="relative mt-10 pl-6 md:pl-0">
        <div className="absolute left-2 top-0 h-full w-[2px] bg-[var(--color-primary)] md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-8">
          {schedule.map((item, index) => (
            <motion.div
              key={`${item.time}-${item.title}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="relative grid gap-4 md:grid-cols-2 md:items-start"
            >
              <div className={`${index % 2 ? "md:order-2" : ""}`}>
                <div className="card-surface rounded-lg bg-[var(--color-surface-2)] p-4">
                  <p className="font-display text-sm text-[var(--color-primary)]">{item.time}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{item.description}</p>
                  <span className="mt-3 inline-block rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-zinc-300">
                    {item.location}
                  </span>
                </div>
              </div>
              <div />
              <div className="timeline-dot absolute left-2 top-4 h-3 w-3 rounded-full bg-[var(--color-primary)] md:left-1/2 md:-translate-x-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
