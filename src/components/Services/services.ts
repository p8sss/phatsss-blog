import {
  AppWindowIcon,
  CodeIcon,
  ComponentIcon,
  DatabaseIcon,
  PenTool02Icon,
  ShoppingBag01Icon,
} from "@/components/ui/icons";

export interface Service {
  readonly title: string;
  readonly description: string;
  readonly icon: typeof AppWindowIcon;
  /** OKLCH hue of the card's accent: its grid, glow, edge and icon tile. */
  readonly hue: number;
}

export const SERVICES: readonly Service[] = [
  {
    title: "Web Application Development",
    description:
      "Building full-featured web applications with secure authentication, data management, and real-time features. Experience with e-wallet systems, dashboards, and various enterprise applications.",
    icon: AppWindowIcon,
    hue: 50,
  },
  {
    title: "Front-End Development",
    description:
      "Creating responsive, modern, and user-friendly web interfaces using React, Next.js, and other cutting-edge front-end technologies. Specializing in building intuitive UIs with smooth interactions and optimal performance.",
    icon: CodeIcon,
    hue: 255,
  },
  {
    title: "Back-End Development",
    description:
      "Developing robust server-side applications using Laravel (PHP), Node.js, and database technologies like MySQL and MongoDB. Creating RESTful APIs and implementing business logic for complex applications.",
    icon: DatabaseIcon,
    hue: 155,
  },
  {
    title: "WordPress Development",
    description:
      "Creating custom WordPress websites with tailored themes and plugins. Optimizing site performance, implementing security measures, and ensuring mobile responsiveness.",
    icon: ComponentIcon,
    hue: 215,
  },
  {
    title: "E-Commerce Solutions",
    description:
      "Building online stores and payment integration systems with secure transaction processing. Experience with crypto payment systems and QR-based payment solutions.",
    icon: ShoppingBag01Icon,
    hue: 350,
  },
  {
    title: "UI/UX Design",
    description:
      "Designing intuitive user interfaces and experiences that balance aesthetics with functionality. Creating wireframes, prototypes, and visual designs that enhance user engagement.",
    icon: PenTool02Icon,
    hue: 295,
  },
];
