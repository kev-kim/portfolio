export type ExperienceEntry = {
  period: string;
  role: string;
  org: string;
  description: string;
  url?: string;
};

export const experience: ExperienceEntry[] = [
  {
    period: "2026",
    role: "Software Engineer Intern",
    org: "IMM Investment",
    description:
      "Built a production RAG pipeline (LangChain, OpenAI, GPT-4) for analyst Q&A over private deal and portfolio data, exposed via FastAPI with on-prem deployment. Automated 20+ workflows eliminating 160 man-hours, and engineered an LLM-based news ETL delivering daily market digests firm-wide.",
    url: "https://imminvestment.com/",
  },
  {
    period: "2024 – 2026",
    role: "Sergeant, KATUSA",
    org: "ROK / U.S. Army",
    description:
      "Korean Augmentation to the United States Army. Completed mandatory military service.",
    url: "https://en.wikipedia.org/wiki/Korean_Augmentation_to_the_United_States_Army",
  },
  {
    period: "May – Aug 2023",
    role: "Software Engineer Intern",
    org: "JHU Applied Physics Laboratory",
    description:
      "Built a real-time ship navigation GPS simulation in Rust and Python, improving computation time by 23%. Implemented a drone vision and control pipeline integrating YOLOv4 and Segment Anything; collaborated with 20+ Navy officers and DoD sponsors to translate operational feedback into system requirements.",
    url: "https://www.jhuapl.edu/",
  },
  {
    period: "2022 – 2023",
    role: "Open-Source Contributor",
    org: "Red Hat PatternFly",
    description:
      "Migrated 30+ React components from JavaScript to TypeScript in PatternFly 4, enforcing strict type safety and accessibility compliance. Shipped production-ready components to a codebase used by 10,000+ enterprise users.",
    url: "https://www.patternfly.org/",
  },
  {
    period: "May – Aug 2022",
    role: "Software Engineer Intern",
    org: "JHU Applied Physics Laboratory",
    description:
      "Uncovered a security vulnerability in the Hotspot 2.0 standard via airborne packet capture over civilian-dense environments using Wireshark and Python. Briefed the office of the CTO and co-authored remediation recommendations.",
    url: "https://www.jhuapl.edu/",
  },
  {
    period: "2022 – 2024",
    role: "Researcher",
    org: "LoReLab, JHU",
    description: "Researched low-resource NLP at JHU's Yarowsky Lab.",
    url: "https://www.cs.jhu.edu/~arya/yarowsky-lab/",
  },
  {
    period: "2021 – 2024",
    role: "Course Assistant",
    org: "Johns Hopkins University",
    description:
      "Lead TA for Gateway Computing; TA for Natural Language Processing; TA for Self-Supervised Models",
  },
];
