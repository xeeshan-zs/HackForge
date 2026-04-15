"use client";

import { categories } from "@/data/categories";
import { Category } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Categories() {
  const [active, setActive] = useState<Category | null>(null);

  return (
    <section id="categories" className="section-container">
      <p className="section-heading">Tracks</p>
      <h2 className="section-title">Competition Categories</h2>
      <div className="mt-2 h-1 w-24 rounded-full bg-[var(--color-primary)]" />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {categories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl border border-white/20 p-6 transition-all duration-300 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/5 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
          >
            {/* Premium badge */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
                PKR {category.registrationFee}
              </div>
            </div>

            <div className="mb-4 text-4xl">{category.icon}</div>
            <h3 className="font-display text-2xl font-bold text-white">{category.name}</h3>
            
            <p className="mt-3 text-sm leading-6 text-white/70">
              {category.description}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                <span className="text-white/60">👥 Team Size:</span>
                <span className="font-semibold text-white">{category.teamSize}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-3 py-2 ml-2">
                <span className="text-white/60">👤 Limit:</span>
                <span className="font-semibold text-white">{category.teamMemberLimit}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActive(category)}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              View Rules & Register
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/30 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{active.icon}</div>
                <div className="flex-1">
                  <h4 className="font-display text-3xl font-bold text-white">{active.name}</h4>
                  <p className="mt-2 text-sm text-white/70">
                    Team Size: <span className="text-white font-semibold">{active.teamSize}</span> • 
                    {' '}<span className="text-white font-semibold">{active.eligibility}</span>
                  </p>
                  <div className="mt-2 bg-blue-500/20 border border-blue-500/30 inline-block rounded-lg px-3 py-1">
                    <p className="text-blue-300 text-sm font-semibold">
                      Registration Fee: PKR {active.registrationFee}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-display text-lg text-white mb-3">Rules & Guidelines</h5>
                <ul className="space-y-2">
                  {active.rules.map((rule, idx) => (
                    <li key={idx} className="flex gap-3 text-white/80 text-sm">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Close
                </button>
                <a
                  href="#register"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-center"
                  onClick={() => setActive(null)}
                >
                  Register Now
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
