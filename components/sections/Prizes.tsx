import { overallBestProject, prizes } from "@/data/prizes";

export default function Prizes() {
  return (
    <section id="prizes" className="section-container">
      <p className="section-heading">Rewards</p>
      <h2 className="section-title">Prizes & Perks</h2>
      <div className="mt-2 h-1 w-20 rounded-full bg-[var(--color-primary)]" />

      <div className="card-surface mt-8 rounded-lg bg-[linear-gradient(135deg,rgba(255,69,0,0.16),rgba(255,215,0,0.08))] p-6">
        <p className="text-sm uppercase tracking-wider text-[var(--color-gold)]">
          Featured Award
        </p>
        <h3 className="font-display mt-2 text-2xl">{overallBestProject.title}</h3>
        <p className="mt-1 text-lg font-bold text-[var(--color-gold)]">
          {overallBestProject.amount}
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{overallBestProject.note}</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {prizes.map((item) => (
          <div key={item.category} className="card-surface rounded-lg p-5">
            <h3 className="font-display text-lg">{item.category}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>🥇 1st: {item.tiers.first}</p>
              <p>🥈 2nd: {item.tiers.second}</p>
              <p>🥉 3rd: {item.tiers.third}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
