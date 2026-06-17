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
      "Designed and deployed an on-prem LLM suite; built ~20 workflow automations adopted across the firm.",
    url: "https://imminvestment.com/"
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
    period: "2022 – 2023",
    role: "Software Engineer Intern",
    org: "JHU Applied Physics Laboratory",
    description: "Two summers of SWE internship at APL.",
    url: "https://www.jhuapl.edu/",
  },
  {
    period: "2022-2023",
    role: "Open-Source Contributor",
    org: "Red Hat PatternFly",
    description: "Contributed to PatternFly 4, Red Hat's open-source design system.",
    url: "https://www.patternfly.org/",
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
      "Lead CA for Gateway Computing: Java (EN.500.112); CA for Prof. Jason Eisner's Natural Language Processing course.",
  },
];
