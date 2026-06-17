import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  variant: "featured" | "compact";
};

export function ProjectCard({ project, variant }: Props) {
  if (variant === "featured") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="group block border border-border rounded-sm p-6 hover:border-accent hover:-translate-y-1 hover:bg-surface transition-all duration-200 no-underline"
      >
        <p className="text-xs font-mono text-muted mb-2 group-hover:text-accent transition-colors">
          {project.stack.join(" · ")}
        </p>
        <h3 className="text-lg font-semibold text-text mb-1 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{project.tagline}</p>
        <p className="mt-4 text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          View project →
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-start justify-between gap-4 border-b border-border py-4 last:border-b-0 no-underline hover:opacity-70 transition-opacity"
    >
      <div>
        <h3 className="text-sm font-semibold text-text">{project.title}</h3>
        <p className="text-sm text-muted">{project.tagline}</p>
      </div>
      <p className="text-xs font-mono text-muted mt-0.5 shrink-0">
        {project.stack.slice(0, 2).join(" · ")}
      </p>
    </Link>
  );
}
