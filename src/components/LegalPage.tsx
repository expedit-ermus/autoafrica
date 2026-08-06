interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
  disclaimer?: boolean;
}

export default function LegalPage({ title, updatedAt, intro, sections, disclaimer = true }: LegalPageProps) {
  return (
    <div className="bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">AutoAfrique</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] mb-2 tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--color-warm-muted)] mb-5 sm:mb-8">Dernière mise à jour : {updatedAt}</p>

        {disclaimer && (
          <div className="mb-8 p-4 rounded-2xl border border-amber-300 bg-amber-50 text-sm text-amber-900 leading-relaxed">
            <p className="font-bold mb-1">Avertissement</p>
            <p>
              Ce document est un gabarit rédigé pour présenter la structure du contenu. Il ne constitue pas un
              texte juridique validé et doit être relu et approuvé par un juriste avant toute mise en production réelle.
            </p>
          </div>
        )}

        {intro && <p className="text-base text-[var(--color-warm-faint)] leading-relaxed mb-5 sm:mb-8">{intro}</p>}

        <div className="space-y-5 sm:space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--color-warm-ink)] mb-2 sm:mb-3">
                {sections.length > 1 ? `${i + 1}. ` : ''}{s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-base text-[var(--color-warm-faint)] leading-relaxed mb-3">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
