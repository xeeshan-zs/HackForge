"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#categories", label: "Categories" },
  { href: "#timeline", label: "Timeline" },
  { href: "#register", label: "Register" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? "bg-black/30 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <a href="#" className="font-display text-xl font-bold tracking-wide">
          <span className="mr-2">⚒</span>
          <span className="bg-gradient-to-r from-cyan-300 via-[var(--color-primary)] to-[var(--color-gold)] bg-clip-text text-transparent">
            HackForge
          </span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-sm text-[var(--color-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#register" className="primary-btn text-xs">
            Register Now
          </a>
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="text-2xl">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col px-4 py-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-[var(--color-text)]"
            >
              {link.label}
            </a>
          ))}
          <a href="#register" className="primary-btn mt-2 text-xs">
            Register Now
          </a>
        </div>
      </motion.div>
    </header>
  );
}
