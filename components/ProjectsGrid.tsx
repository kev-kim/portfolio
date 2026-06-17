import { featuredProjects, compactProjects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";

export function ProjectsGrid() {
  return (
    <section id="projects" className="mx-auto max-w-2xl px-6 py-20 border-t border-border">
      <Reveal>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-12">Projects</h2>
      </Reveal>

      {/* Featured */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} variant="featured" />
          </Reveal>
        ))}
      </div>

      {/* Compact */}
      <Reveal>
        <div className="border-t border-border">
          {compactProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="compact" />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
