import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Footer } from "@/components/Footer";
import { ToyboxPanel } from "@/components/ToyboxPanel";

export default function Home() {
  return (
    <>
      <Header />
      <ToyboxPanel />
      <main>
        <Hero />
        <About />
        <ProjectsGrid />
        <ExperienceTimeline />
      </main>
      <Footer />
    </>
  );
}
