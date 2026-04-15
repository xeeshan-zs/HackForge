const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#categories", label: "Categories" },
  { href: "#rules", label: "Rules" },
  { href: "#timeline", label: "Timeline" },
  { href: "#register", label: "Register" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/60">
      <div className="section-container py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <div className="font-display text-xl font-bold">
              ⚒ <span className="text-[var(--color-primary)]">HackForge</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-[var(--color-muted)]">
              Forge your future with ACM Chapter NUML Lahore.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          HackForge 2026 © ACM Chapter NUML Lahore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
