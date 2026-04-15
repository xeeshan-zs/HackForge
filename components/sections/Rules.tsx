"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const rules = [
  "All participants must carry a valid student ID on event day.",
  "Teams must remain within category-specific size constraints.",
  "Plagiarism or copied work leads to immediate disqualification.",
  "Submissions after deadline will not be accepted.",
  "Respect judges, organizers, and fellow participants.",
  "Participants are responsible for their own equipment and backups.",
  "Organizer decisions are final and binding.",
  "Any misconduct may result in removal from the event.",
];

export default function Rules() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="rules" className="section-container">
      <p className="section-heading">Policy</p>
      <h2 className="section-title">Rules & Guidelines</h2>
      <div className="mt-2 h-1 w-24 rounded-full bg-[var(--color-primary)]" />

      <div className="mt-10 space-y-3">
        {rules.map((rule, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={rule} className="card-surface rounded-md">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-4 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>Rule #{index + 1}</span>
                <span>{isOpen ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-[var(--color-muted)]">{rule}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <a
        href="/rules.pdf"
        className="secondary-btn mt-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Full Rules
      </a>
    </section>
  );
}
