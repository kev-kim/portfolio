import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
};

export function ProjectDetail({ project }: Props) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-text transition-colors no-underline mb-10"
      >
        ← Back to projects
      </Link>

      <p className="text-xs font-mono text-muted mb-3">{project.stack.join(" · ")}</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">{project.title}</h1>
      <p className="text-lg text-muted mb-8">{project.tagline}</p>

      <div className="border-t border-border pt-8 space-y-8">
        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Summary</h2>
          <p className="text-base leading-relaxed">{project.summary}</p>
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Role</h2>
          <p className="text-base leading-relaxed">{project.role}</p>
        </section>

        {project.highlights.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
              Highlights
            </h2>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="text-sm text-muted flex gap-2">
                  <span className="text-accent mt-0.5">—</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.links.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-border rounded-sm text-sm hover:border-accent hover:text-accent transition-colors no-underline"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
