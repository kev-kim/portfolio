import { profile } from "@/content/profile";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-2xl px-6 py-20 border-t border-border">
      <Reveal>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-8">About</h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="text-lg leading-relaxed">{profile.bio}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <span className="inline-block mt-6 px-3 py-1 border border-border rounded-sm text-xs font-mono text-muted">
          {profile.clearance}
        </span>
      </Reveal>
    </section>
  );
}
