import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectDetail } from "@/components/ProjectDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Kevin Kim`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <main>
        <ProjectDetail project={project} />
      </main>
      <Footer />
    </>
  );
}
