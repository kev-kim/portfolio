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
    slug: "sijang",
    title: "Sijang",
    tagline: "Korean market intelligence platform.",
    featured: true,
    role: "Solo developer.",
    stack: ["FastAPI", "PostgreSQL", "pgvector", "Next.js", "TypeScript", "Dagster", "Supabase"],
    summary:
      "A Korean market intelligence platform covering 3,000+ company profiles, with semantic and full-text search powered by pgvector and Meilisearch for 50+ users.",
    highlights: [
      "Built a FastAPI + PostgreSQL backend with pgvector and Meilisearch powering semantic and full-text search across 3,000+ company profiles.",
      "Engineered a multi-stage NLP pipeline in Dagster using Gemini Flash for triage and Claude Sonnet for structured entity and event extraction, with Voyage AI embeddings and SimHash-based deduplication.",
      "Built a Next.js + TypeScript frontend with real-time news timelines and company-level filtering, deployed on Vercel with Supabase Auth and Fly.io API hosting.",
    ],
    links: [{ label: "Live demo", href: "/kci" }],
  },
  {
    slug: "splitit",
    title: "Split.it",
    tagline: "Fare-splitting platform for the JHU community.",
    featured: true,
    role: "Backend architecture, external-service integrations, full chat backend, documentation.",
    stack: ["MongoDB", "Express", "React", "Node.js", "WebSockets", "AWS Lambda"],
    summary:
      "A platform that helps JHU students using ride-share apps find others to split fares with, leveraging the trust of the Hopkins community to make cheap transport easy to organize.",
    highlights: [
      "Launched to 2,000+ active JHU users with a fully integrated real-time chat system built on WebSockets.",
      "Secured the API layer with end-to-end encryption, AWS Lambda tokenization, and OAuth2 SSO via JHU student accounts.",
      "Automated deployment with a GitHub Actions CI/CD pipeline.",
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
    tagline: "Ensemble knowledge distillation for domain-specific QA.",
    featured: false,
    role: "Team member (3-person project).",
    stack: ["Python", "PyTorch", "Hugging Face Transformers", "Weights & Biases"],
    summary:
      "Stacked Ensemble of Expert Models — an NLP pipeline that fine-tunes specialist models on domain-specific datasets and uses a learned routing mechanism to direct queries to the right expert.",
    highlights: [
      "Fine-tuned domain-specific expert models on ARC, SciQ, MedMCQA, and AquaRat benchmarks.",
      "Built a query router that maps inputs to the most relevant specialist using learned routing maps.",
      "Applied knowledge distillation across the ensemble to compress multi-domain QA performance.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/kev-kim/SEEK-Stacked-Ensemble-of-Expert-Models" },
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
