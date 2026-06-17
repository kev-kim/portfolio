import { experience } from "@/content/experience";
import { Reveal } from "@/components/motion/Reveal";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="mx-auto max-w-2xl px-6 py-20 border-t border-border">
      <Reveal>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-12">
          Experience
        </h2>
      </Reveal>
      <ol className="relative border-l border-border ml-2 flex flex-col gap-10">
        {experience.map((entry, i) => (
          <Reveal key={i} delay={i * 0.07} as="li" className="pl-8 relative">
            <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-text border-2 border-bg" />
            <p className="text-xs font-mono text-muted mb-1">{entry.period}</p>
            <p className="font-semibold text-sm">
              {entry.role}
              {" — "}
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors no-underline border-b border-current"
                >
                  {entry.org}
                </a>
              ) : (
                <span className="text-muted font-normal">{entry.org}</span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted leading-relaxed">{entry.description}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
