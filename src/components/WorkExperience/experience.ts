import { translate } from "@docusaurus/Translate";
import { earliest, monthsBetween, type YearMonth } from "@/lib/month-range";

export type EngagementType = "fullTime" | "partTime" | "freelance" | "education";

export interface Role {
  readonly title: string;
  readonly type: EngagementType;
  readonly start: YearMonth;
  /** `null` while ongoing */
  readonly end: YearMonth | null;
  readonly description: string;
  /** Technologies named in the description */
  readonly stack: readonly string[];
}

export interface Organisation {
  readonly id: string;
  readonly name: string;
  readonly monogram: string;
  readonly kind: "work" | "education";
  /** Newest first */
  readonly roles: readonly Role[];
}

/** Called at render, so translate() resolves for the current locale. */
export function getOrganisations(): readonly Organisation[] {
  return [
    {
      id: "tsd",
      name: "TSD",
      monogram: "TS",
      kind: "work",
      roles: [
        {
          title: "Senior Developer",
          type: "fullTime",
          start: { year: 2025, month: 7 },
          end: null,
          description: translate({ id: "workExperience.tsdDescription" }),
          stack: [
            "Next.js",
            "React",
            "TypeScript",
            "NestJS",
            "Node.js",
            "Go",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Kubernetes",
            "OAuth 2.0 / OIDC",
            "GitHub Actions",
            "Tailwind CSS",
            "AI agents",
          ],
        },
      ],
    },
    {
      id: "lao-it-dev",
      name: "Lao IT Dev Co., Ltd.",
      monogram: "LI",
      kind: "work",
      roles: [
        {
          title: "Front-End Developer",
          type: "fullTime",
          start: { year: 2019, month: 10 },
          end: { year: 2025, month: 6 },
          description: translate({ id: "workExperience.content1Description" }),
          stack: ["Next.js", "React", "TypeScript", "TanStack Query", "Tailwind CSS", "Binance API"],
        },
        {
          title: "Software Engineer",
          type: "partTime",
          start: { year: 2019, month: 7 },
          end: { year: 2019, month: 10 },
          description: translate({ id: "workExperience.content2Description" }),
          stack: ["Laravel", "PHP", "MySQL", "Blade"],
        },
      ],
    },
    {
      id: "freelance",
      name: "Freelance",
      monogram: "FL",
      kind: "work",
      roles: [
        {
          title: "Outsource Software Developer",
          type: "freelance",
          start: { year: 2019, month: 12 },
          end: null,
          description: translate({ id: "workExperience.content4Description" }),
          stack: ["React", "Next.js", "NestJS", "Node.js", "TypeScript", "Laravel", "PostgreSQL", "Redux-Saga", "Vite", "Tailwind CSS"],
        },
      ],
    },
    {
      id: "nuol",
      name: "National University of Laos (NUOL)",
      monogram: "NU",
      kind: "education",
      roles: [
        {
          title: "Web Development Student",
          type: "education",
          start: { year: 2016, month: 10 },
          end: { year: 2020, month: 10 },
          description: translate({ id: "workExperience.content3Description" }),
          stack: ["Laravel", "MySQL"],
        },
      ],
    },
  ];
}

/** Whole years since the first work (non-education) role began; drives the "{years}+ years" copy. */
export function yearsOfExperience(organisations: readonly Organisation[], today: YearMonth): number {
  const starts = organisations
    .filter((organisation) => organisation.kind === "work")
    .flatMap((organisation) => organisation.roles.map((role) => role.start));
  if (starts.length === 0) return 0;
  return Math.floor(monthsBetween(earliest(starts), today) / 12);
}

export function engagementLabel(type: EngagementType): string {
  switch (type) {
    case "fullTime":
      return translate({ id: "workExperience.type.fullTime", message: "Full-time" });
    case "partTime":
      return translate({ id: "workExperience.type.partTime", message: "Part-time" });
    case "freelance":
      return translate({ id: "workExperience.type.freelance", message: "Freelance" });
    case "education":
      return translate({ id: "workExperience.type.education", message: "Education" });
  }
}
