import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Button } from "@/components/glass/button";
import { Badge } from "@/components/glass/badge";
import { Card } from "@/components/glass/card";
import {
  ArrowUpRight01Icon,
  CubeIcon,
  GithubIcon,
} from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";
import { LandingPicture } from "@/components/LandingPicture";
import type { LandingImageName } from "@/lib/landing-images";

const projects = [
  {
    title: "Covid-19 Tracker",
    description: "Web application for tracking COVID-19 statistics.",
    technologies: [
      "Vite",
      "React",
      "TypeScript",
      "Redux-saga",
      "Antd-design",
      "MapBox",
    ],
    image: "covid-la-img",
    link: "https://covid19-la.netlify.app/",
    projectLink: "https://github.com/phatsss/covid19-la",
  },
  {
    title: "Bento Grid Layout",
    description:
      "Responsive layout grid with various components and animations.",
    technologies: ["Vite", "React", "TypeScript", "Tailwind CSS"],
    image: "bento-grid-img",
    link: "https://phatsss.github.io/valentine-dev/",
    projectLink: "https://github.com/phatsss/valentine-dev",
  },
] satisfies Array<Record<string, unknown> & { image: LandingImageName }>;

export default function SideProjects(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-0 py-14 sm:px-6 sm:py-20">
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
          // the card isn't a link (its Demo/Code buttons are), so no asChild press state
          <article key={index} className="flex">
            <Card className="group w-full gap-0 overflow-hidden py-0 transition-all hover:border-muted-foreground/30 hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <LandingPicture name={project.image} alt={project.title} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-background/80 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:bg-transparent [@media(hover:none)]:items-end [@media(hover:none)]:justify-end [@media(hover:none)]:p-3 [@media(hover:none)]:opacity-100 [@media(hover:none)]:backdrop-blur-none">
                  {/* glass: legible both on the hover scrim and straight over the screenshot (touch) */}
                  <Button asChild size="sm" variant="glass">
                    <a href={project.link} target="_blank" rel="noreferrer noopener">
                      Demo <ArrowUpRight01Icon size={16} />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="glass">
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
                <p className="!mb-0 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-sm">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="bg-muted/50 text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
}
