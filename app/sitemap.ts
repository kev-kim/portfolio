import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getAllPuzzles } from "@/lib/onedle/puzzles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kev-kim.com";
  const todayStr = new Date().toISOString().slice(0, 10);
  const puzzles = getAllPuzzles().filter((p) => p.date <= todayStr);

  return [
    { url: base, lastModified: new Date(), priority: 1, changeFrequency: "monthly" },
    { url: `${base}/onedle`, lastModified: new Date(), priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/onedle/archive`, lastModified: new Date(), priority: 0.6, changeFrequency: "daily" },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...puzzles.map((p) => ({
      url: `${base}/onedle/${p.id}`,
      lastModified: new Date(p.date),
      priority: 0.5,
      changeFrequency: "never" as const,
    })),
  ];
}
