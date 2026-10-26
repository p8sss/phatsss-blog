import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Card } from "@/components/glass/card";
import {
  AppWindowIcon,
  CodeIcon,
  ComponentIcon,
  DatabaseIcon,
  PenTool02Icon,
  ShoppingBag01Icon,
  Layers02Icon,
} from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";

const services = [
  {
    title: "Web Application Development",
    description:
      "Building full-featured web applications with secure authentication, data management, and real-time features. Experience with e-wallet systems, dashboards, and various enterprise applications.",
    icon: AppWindowIcon,
  },
  {
    title: "Front-End Development",
    description:
      "Creating responsive, modern, and user-friendly web interfaces using React, Next.js, and other cutting-edge front-end technologies. Specializing in building intuitive UIs with smooth interactions and optimal performance.",
    icon: CodeIcon,
  },
  {
    title: "Back-End Development",
    description:
      "Developing robust server-side applications using Laravel (PHP), Node.js, and database technologies like MySQL and MongoDB. Creating RESTful APIs and implementing business logic for complex applications.",
    icon: DatabaseIcon,
  },
  {
    title: "WordPress Development",
    description:
      "Creating custom WordPress websites with tailored themes and plugins. Optimizing site performance, implementing security measures, and ensuring mobile responsiveness.",
    icon: ComponentIcon,
  },
  {
    title: "E-Commerce Solutions",
    description:
      "Building online stores and payment integration systems with secure transaction processing. Experience with crypto payment systems and QR-based payment solutions.",
    icon: ShoppingBag01Icon,
  },
  {
    title: "UI/UX Design",
    description:
      "Designing intuitive user interfaces and experiences that balance aesthetics with functionality. Creating wireframes, prototypes, and visual designs that enhance user engagement.",
    icon: PenTool02Icon,
  },
];

export default function Services(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <Layers02Icon size={14} /> {translate({ id: "service.title" })}
          </>
        }
        title={translate({ id: "service.title" })}
        description={translate({ id: "service.description" })}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card
              key={index}
              className="group gap-4 p-6 transition-all hover:border-muted-foreground/30 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={22} />
              </div>
              <h3 className="!mb-0 !text-lg !font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="!mb-0 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
