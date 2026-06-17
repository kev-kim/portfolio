import { profile } from "@/content/profile";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section id="hero" className="mx-auto max-w-2xl px-6 pt-24 pb-20">
      <Reveal>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-tight">
          {profile.name}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-4 text-xl text-muted">{profile.headline}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="px-5 py-2.5 bg-text text-bg text-sm font-medium rounded-sm hover:opacity-80 transition-opacity no-underline"
          >
            View Projects
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className="px-5 py-2.5 border border-border text-text text-sm font-medium rounded-sm hover:bg-surface transition-colors no-underline"
          >
            Contact
          </a>
        </div>
      </Reveal>
    </section>
  );
}
