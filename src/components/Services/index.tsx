import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Card } from "@/components/glass/card";
import { cn } from "@/lib/utils";
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
    <section className="mx-auto w-full max-w-5xl px-0 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={
          <>
            <Layers02Icon size={14} /> {translate({ id: "service.title" })}
          </>
        }
        title={translate({ id: "service.title" })}
        description={translate({ id: "service.description" })}
      />

      {/* phones: compact rows · sm: 2 columns · lg: bento, the first service a 2×2 feature */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          const featured = index === 0;
          return (
            <Card
              key={service.title}
              className={cn(
                "group relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 p-4 transition-all hover:border-muted-foreground/30 hover:shadow-md sm:flex sm:gap-4 sm:p-6",
                featured && "lg:col-span-2 lg:row-span-2 lg:justify-end lg:gap-5 lg:p-10"
              )}
            >
              {featured && (
                // the feature's watermark: its own icon, oversized and faint
                <Icon
                  aria-hidden="true"
                  size={260}
                  className="pointer-events-none absolute -top-6 -right-6 hidden text-foreground opacity-[0.05] lg:block"
                />
              )}
              <div
                className={cn(
                  "row-span-2 flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-11",
                  featured &&
                    "lg:mb-auto lg:size-14 lg:rounded-xl lg:border-transparent lg:bg-[linear-gradient(135deg,oklch(0.62_0.16_50),oklch(0.55_0.2_355))] lg:text-white"
                )}
              >
                <Icon size={featured ? 26 : 22} />
              </div>
              <h3 className={cn("!mb-0 !text-base !font-semibold tracking-tight sm:!text-lg", featured && "lg:!text-3xl")}>
                {service.title}
              </h3>
              <p
                className={cn(
                  "!mb-0 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted-foreground sm:line-clamp-none sm:text-sm",
                  featured && "lg:max-w-lg lg:text-base"
                )}
              >
                {service.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
