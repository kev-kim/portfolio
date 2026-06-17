export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  featured: boolean;
  role: string;
  stack: string[];
  summary: string;
  highlights: string[];
  links: ProjectLink[];
  images?: string[];
};

export const projects: Project[] = [
  {
    slug: "splitit",
    title: "Split.it",
    tagline: "Fare-splitting platform for the JHU community.",
    featured: true,
    role: "Backend architecture, external-service integrations, full chat backend, documentation.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    summary:
      "A platform that helps JHU students using ride-share apps find others to split fares with, leveraging the trust of the Hopkins community to make cheap transport easy to organize.",
    highlights: [
      "Designed and built the entire backend architecture.",
      "Integrated external ride-sharing and payment services.",
      "Built the fully-integrated real-time chat backend from scratch.",
      "Authored most of the project documentation.",
    ],
    links: [
      { label: "Live site", href: "https://www.trysplit.it/" },
      { label: "Docs", href: "https://trysplit-it.github.io/docs/" },
      // TODO: add repo link when available
    ],
  },
  {
    slug: "seek",
    title: "SEEK",
    tagline: "Making large language models smaller and smarter.",
    featured: true,
    // TODO: confirm role
    role: "TODO",
    // TODO: confirm ML/NLP libraries used
    stack: ["Python" /* TODO: add ML/NLP libraries */],
    summary:
      "Stacked Ensemble of Expert Knowledge — an ML/NLP pipeline that uses model distillation to improve a large language model's performance on domain-specific knowledge.",
    // TODO: fill in highlights
    highlights: [
      "TODO: add project highlights.",
    ],
    links: [
      // TODO: add repo / writeup link
    ],
  },
  {
    slug: "gan-inpainting",
    title: "GAN Image Inpainting",
    tagline: "Training a GAN to fill masked regions in images.",
    featured: false,
    role: "Team member (4-person project).",
    stack: ["Python", "PyTorch"],
    summary:
      "Built and trained a Generative Adversarial Network for image inpainting, benchmarked against Navier–Stokes and Fast-Marching analytical baselines using Fréchet Inception Distance (FID).",
    highlights: [
      "Designed and trained a GAN for image infilling.",
      "Compared against Navier–Stokes and Fast-Marching baselines.",
      "Evaluated using Fréchet Inception Distance (FID).",
    ],
    links: [{ label: "GitHub", href: "https://github.com/kev-kim/Image-Infilling-GAN" }],
  },
  {
    slug: "quest2learn",
    title: "Quest2Learn",
    tagline: "Augmented reality for lab-science education.",
    featured: false,
    role: "Developed lab units in the Unity (C#) environment.",
    stack: ["Unity", "C#", "AR"],
    summary:
      "An augmented-reality application that enhances online and on-campus lab-science education, developed with JHU faculty to address limited hands-on lab access.",
    highlights: [
      "Built AR lab units in Unity (C#).",
      "Collaborated with JHU faculty to design educational content.",
    ],
    links: [
      // TODO: confirm Notion link is still live before adding
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const compactProjects = projects.filter((p) => !p.featured);
