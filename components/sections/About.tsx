const stats = [
  { value: "7+", label: "Categories", icon: "⚙️" },
  { value: "PKR 200,000+", label: "Prize Pool", icon: "🏆" },
  { value: "500+", label: "Expected Participants", icon: "🚀" },
];

export default function About() {
  return (
    <section id="about" className="section-container">
      <p className="section-heading">Overview</p>
      <h2 className="section-title">What is HackForge?</h2>
      <div className="mt-2 h-1 w-20 rounded-full bg-[var(--color-primary)]" />

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-[15px] leading-7 text-zinc-300">
          <p>
            HackForge is NUML&apos;s flagship coding and innovation competition, built
            to challenge students through high-energy technical tracks.
          </p>
          <p>
            From problem solving and cybersecurity to product design and business
            pitches, participants compete, collaborate, and present ideas that matter.
          </p>
          <p>
            The event combines skill-based competition with mentorship, community, and
            recognition from academia and industry judges.
          </p>
          <p>
            This platform is the central place for event details, schedule, and
            registration.
          </p>
        </div>

        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card-surface rounded-lg p-5">
              <div className="mb-2 text-xl">{stat.icon}</div>
              <div className="font-display text-3xl font-bold text-[var(--color-primary)]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
