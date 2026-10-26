import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase01Icon } from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";

const experiences = [
  {
    title: "Full-Time Front-End Developer",
    company: "Lao IT Dev Co., Ltd.",
    period: "10/2019 – Present",
    description: translate({ id: "workExperience.content1Description" }),
  },
  {
    title: "Outsource Software Developer",
    company: "FreeLance",
    period: "12/2019 – Present",
    description: translate({ id: "workExperience.content4Description" }),
  },
  {
    title: "Part-Time Software Engineer",
    company: "Lao IT Dev Co., Ltd.",
    period: "07/2019 – 10/2019",
    description: translate({ id: "workExperience.content2Description" }),
  },
  {
    title: "Web Development Student",
    company: "National University of Laos (NUOL)",
    period: "10/2016 - 10/2020",
    description: translate({ id: "workExperience.content3Description" }),
  },
];

export default function WorkExperience(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <Briefcase01Icon size={14} /> {translate({ id: "workExperience.title" })}
          </>
        }
        title={translate({ id: "workExperience.title" })}
        description={translate({ id: "workExperience.description" })}
      />

      <div className="relative ml-4 space-y-8 border-l border-border pl-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            <span className="absolute -left-[41px] top-6 size-2.5 rounded-full border-2 border-background bg-muted-foreground/50" />
            <Card className="gap-0 p-6 transition-colors hover:border-muted-foreground/30">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="!text-lg !font-semibold !mb-0 tracking-tight">
                  {exp.title}
                </h3>
                <Badge variant="secondary">{exp.period}</Badge>
              </div>
              <p className="!mb-3 text-sm font-medium text-muted-foreground">
                {exp.company}
              </p>
              <p className="!mb-0 text-[0.95rem] leading-relaxed text-foreground/80">
                {exp.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
