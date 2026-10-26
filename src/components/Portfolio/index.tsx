import { useState, JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ArrowUpRight01Icon, Folder01Icon } from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";

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
    image: "./img/landing/e-wallet-img.png",
    link: "#",
  },
  {
    title: "Gas Management System",
    description:
      "Inventory management system for gas importers to track stock, deliveries, and sales with comprehensive reporting.",
    technologies: [
      "Next.js",
      "React",
      "Typescript",
      "TanStack Query",
      "Re-Chart",
      "Antd-design",
    ],
    category: "Enterprise Software",
    image: "./img/landing/petro-img.png",
    link: "#",
  },
  {
    title: "Crypto Investment Platform",
    description:
      "Investment platform with Binance API integration for real-time portfolio tracking and LaoQR payment integration.",
    technologies: [
      "Next.js",
      "React",
      "Typescript",
      "Node.js",
      "Binance API",
      "Supabase",
      "LaoQR",
    ],
    category: "Financial Technology",
    image: "./img/landing/bitcoin-img.png",
    link: "#",
  },
  {
    title: "Postal Management System",
    description:
      "Platform for shipping companies to manage packages, track deliveries, and generate reports.",
    technologies: [
      "Vite",
      "React",
      "Typescript",
      "TanStack Query",
      "Antd-design",
    ],
    category: "Logistics",
    image: "./img/landing/postal-img.png",
    link: "#",
  },
  {
    title: "Insurance Management System",
    description:
      "Comprehensive system for policy creation, claims processing, and reporting to simplify insurance workflows.",
    technologies: ["React", "Redux", "Redux-saga", "Typescript", "Antd-design"],
    category: "Enterprise Software",
    image: "./img/landing/insurance-img.png",
    link: "#",
  },
  {
    title: "Education Platform",
    description:
      "Student management system with enrollment, QR payment, card generation, and course evaluation features.",
    technologies: [
      "React",
      "Typescript",
      "Laravel",
      "PHP",
      "MySQL",
      "Blade",
      "Web-Socket",
    ],
    category: "Education",
    image: "./img/landing/education-img.png",
    link: "#",
  },
  {
    title: "POS System",
    description:
      "Point of sale system with barcode scanning, inventory management, and sales reporting.",
    technologies: ["React", "Typescript", "Redux", "Redux-saga", "Tailwinds"],
    category: "Point of Sale",
    image: "./img/landing/pos-img.png",
    link: "#",
  },
  {
    title: "HR System",
    description:
      "Human resources management system with employee management, payroll, and performance tracking.",
    technologies: ["NestJS", "NodeJS", "Typescript", "PostgreSQL", "Postman"],
    category: "Enterprise Software",
    image: "./img/landing/hr-img.png",
    link: "#",
  },
];

const categories = [
  "All",
  "Financial Technology",
  "Enterprise Software",
  "Logistics",
  "Point of Sale",
  "Education",
];

export default function Portfolio(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <Folder01Icon size={14} /> {translate({ id: "portfolio.title" })}
          </>
        }
        title={translate({ id: "portfolio.title" })}
        description={translate({ id: "portfolio.description" })}
      />

      <div className="mb-10 flex justify-center">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="flex flex-col items-center gap-4"
        >
          <TabsList className="flex-wrap justify-center h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="h-8">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory} className="w-full">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
              <Card
                asChild
                key={index}
                className="group gap-0 overflow-hidden py-0 transition-all hover:border-muted-foreground/30 hover:shadow-md"
              >
                <article>
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline">{project.category}</Badge>
                      {project.link && project.link !== "#" && (
                        <a
                          href={project.link}
                          aria-label={`Open ${project.title}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ArrowUpRight01Icon size={18} />
                        </a>
                      )}
                    </div>
                    <h3 className="!mb-0 !text-base !font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <p className="!mb-0 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="bg-muted/50 text-[11px] font-medium text-muted-foreground"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
