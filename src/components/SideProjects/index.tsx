import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight01Icon,
  CubeIcon,
  GithubIcon,
} from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";

const projects = [
  {
    title: "Covid-19 Tracker",
    description: "Web application for tracking COVID-19 statistics.",
    technologies: [
      "Vite",
      "React",
      "Typescript",
      "Redux-saga",
      "Antd-design",
      "MapBox",
    ],
    image: "./img/landing/covid-la-img.jpeg",
    link: "https://covid19-la.netlify.app/",
    projectLink: "https://github.com/phatsss/covid19-la",
  },
  {
    title: "Bento Grid Layout",
    description:
      "Responsive layout grid with various components and animations.",
    technologies: ["Vite", "React", "Typescript", "tailwindcss"],
    image: "./img/landing/bento-grid-img.png",
    link: "https://phatsss.github.io/valentine-dev/",
    projectLink: "https://github.com/phatsss/valentine-dev",
  },
];

export default function SideProjects(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <CubeIcon size={14} /> {translate({ id: "sideProject.title" })}
          </>
        }
        title={translate({ id: "sideProject.title" })}
        description={translate({ id: "sideProject.description" })}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
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
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-background/80 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <Button asChild size="sm" variant="secondary">
                    <a href={project.link} target="_blank" rel="noreferrer noopener">
                      Demo <ArrowUpRight01Icon size={16} />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <GithubIcon size={16} /> Code
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="!mb-0 !text-lg !font-semibold tracking-tight">
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
    </section>
  );
}
