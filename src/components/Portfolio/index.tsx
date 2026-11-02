import { useId, useState, type JSX } from "react";
import { translate } from "@docusaurus/Translate";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import { Badge } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { Card } from "@/components/glass/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/glass/tabs";
import { ArrowUpRight01Icon, Folder01Icon } from "@/components/ui/icons";
import { useExperienceYears } from "@/hooks/use-experience-years";
import { cn } from "@/lib/utils";
import SectionHeading from "../SectionHeading";
import { LandingPicture } from "@/components/LandingPicture";
import type { LandingImageName } from "@/lib/landing-images";

const projects = [
  {
    title: "E-Wallet System",
    description:
      "Secure wallet application with balance view, transaction history, and QR payment features.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "TanStack Query",
      "Antd-design",
    ],
    category: "Financial Technology",
    image: "e-wallet-img",
    link: "#",
  },
  {
    title: "Gas Management System",
    description:
      "Inventory management system for gas importers to track stock, deliveries, and sales with comprehensive reporting.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "TanStack Query",
      "Re-Chart",
      "Antd-design",
    ],
    category: "Enterprise Software",
    image: "petro-img",
    link: "#",
  },
  {
    title: "Crypto Investment Platform",
    description:
      "Investment platform with Binance API integration for real-time portfolio tracking and LaoQR payment integration.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Binance API",
      "Supabase",
      "LaoQR",
    ],
    category: "Financial Technology",
    image: "bitcoin-img",
    link: "#",
  },
  {
    title: "Postal Management System",
    description:
      "Platform for shipping companies to manage packages, track deliveries, and generate reports.",
    technologies: [
      "Vite",
      "React",
      "TypeScript",
      "TanStack Query",
      "Antd-design",
    ],
    category: "Logistics",
    image: "postal-img",
    link: "#",
  },
  {
    title: "Insurance Management System",
    description:
      "Comprehensive system for policy creation, claims processing, and reporting to simplify insurance workflows.",
    technologies: ["React", "Redux", "Redux-saga", "TypeScript", "Antd-design"],
    category: "Enterprise Software",
    image: "insurance-img",
    link: "#",
  },
  {
    title: "Education Platform",
    description:
      "Student management system with enrollment, QR payment, card generation, and course evaluation features.",
    technologies: [
      "React",
      "TypeScript",
      "Laravel",
      "PHP",
      "MySQL",
      "Blade",
      "Web-Socket",
    ],
    category: "Education",
    image: "education-img",
    link: "#",
  },
  {
    title: "POS System",
    description:
      "Point of sale system with barcode scanning, inventory management, and sales reporting.",
    technologies: ["React", "TypeScript", "Redux", "Redux-saga", "Tailwind CSS"],
    category: "Point of Sale",
    image: "pos-img",
    link: "#",
  },
  {
    title: "HR System",
    description:
      "Human resources management system with employee management, payroll, and performance tracking.",
    technologies: ["NestJS", "NodeJS", "TypeScript", "PostgreSQL", "Postman"],
    category: "Enterprise Software",
    image: "hr-img",
    link: "#",
  },
] satisfies Array<Record<string, unknown> & { image: LandingImageName }>;

const categories = [
  "All",
  "Financial Technology",
  "Enterprise Software",
  "Logistics",
  "Point of Sale",
  "Education",
];

type Project = (typeof projects)[number];

/** Cards shown on phones before "Show all projects". */
const MOBILE_PREVIEW_COUNT = 4;

/** `"#"` is a placeholder: those projects are private, so the card isn't a link. */
function hasLink(project: Project): boolean {
  return Boolean(project.link) && project.link !== "#";
}

function ProjectCard({ project, featured, className }: { project: Project; featured: boolean; className?: string }): JSX.Element {
  const linked = hasLink(project);
  return (
    <article className={cn("flex", featured && "lg:col-span-2", className)}>
      <Card
        className={cn(
          "w-full gap-0 overflow-hidden py-0",
          // lift only what actually leads somewhere
          linked && "group transition-all hover:border-muted-foreground/30 hover:shadow-md"
        )}
      >
        <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", featured && "lg:aspect-[16/7]")}>
          <LandingPicture
            name={project.image}
            alt={project.title}
            className={cn("size-full object-cover", linked && "transition-transform duration-300 group-hover:scale-105")}
          />
        </div>
        <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "lg:px-6")}>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{project.category}</Badge>
            {linked && (
              <a
                href={project.link}
                aria-label={`Open ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowUpRight01Icon size={18} />
              </a>
            )}
          </div>
          <h3 className={cn("!mb-0 !text-base !font-semibold tracking-tight", featured && "lg:!text-lg")}>{project.title}</h3>
          <p className="!mb-0 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-sm">{project.description}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="bg-muted/50 text-xs font-medium text-muted-foreground">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </article>
  );
}

export default function Portfolio(): JSX.Element {
  // register the hero CTA's #portfolio target with the broken-anchor checker
  useBrokenLinks().collectAnchor("portfolio");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const gridId = useId();
  const years = useExperienceYears();

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);
  // in the 3-column grid, a count one short of a full row gets a 2-column
  // first card instead of an orphan gap (8 → 2+1, 3, 3)
  const featureFirst = filteredProjects.length % 3 === 2;
  const canCollapse = filteredProjects.length > MOBILE_PREVIEW_COUNT;

  return (
    <section id="portfolio" className="mx-auto w-full max-w-5xl scroll-mt-20 px-0 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={
          <>
            <Folder01Icon size={14} /> {translate({ id: "portfolio.title" })}
          </>
        }
        title={translate({ id: "portfolio.title" })}
        description={translate(
          {
            id: "portfolio.description",
            message: "Explore a selection of projects I've developed throughout my {years}+ years of professional experience.",
          },
          { years }
        )}
      />

      <div className="flex justify-center">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="flex w-full min-w-0 flex-col items-center gap-4"
        >
          {/* one row that scrolls sideways on phones instead of wrapping into an oval */}
          <TabsList className="h-auto max-w-full snap-x justify-start overflow-x-auto scroll-px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="h-10 flex-none snap-start sm:h-8 [@media(pointer:coarse)]:h-10"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory} className="w-full">
            <div id={gridId} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  featured={featureFirst && index === 0}
                  // phones: the first few, the rest behind the button (all of them from sm up)
                  className={cn(!showAll && index >= MOBILE_PREVIEW_COUNT && "hidden sm:flex")}
                />
              ))}
            </div>
            {canCollapse && (
              <div className="mt-8 flex justify-center sm:hidden">
                <Button
                  variant="glass"
                  size="lg"
                  aria-expanded={showAll}
                  aria-controls={gridId}
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll
                    ? translate({ id: "portfolio.showFewer", message: "Show fewer projects" })
                    : translate(
                        { id: "portfolio.showAll", message: "Show all projects ({count})" },
                        { count: filteredProjects.length }
                      )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
