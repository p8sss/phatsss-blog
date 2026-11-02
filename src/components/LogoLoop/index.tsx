import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiLaravel,
  SiPhp,
  SiNodedotjs,
  SiNestjs,
  SiPrisma,
  SiGit,
  SiDocker,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiWebpack,
  SiBabel,
  SiGithub,
  SiGooglecloud,
  SiDigitalocean,
} from "react-icons/si";
import LogoLoop from "./LogoLoop";

const techLogos = [
  {
    node: <SiReact />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiNodedotjs />,
    title: "Node.js",
    href: "https://nodejs.org/",
  },
  {
    node: <SiLaravel />,
    title: "Laravel",
    href: "https://laravel.com/",
  },
  {
    node: <SiPhp />,
    title: "PHP",
    href: "https://www.php.net/",
  },
  {
    node: <SiNestjs />,
    title: "NestJS",
    href: "https://nestjs.com/",
  },
  {
    node: <SiPrisma />,
    title: "Prisma",
    href: "https://www.prisma.io/",
  },
  {
    node: <SiGithub />,
    title: "Github",
    href: "https://github.com/",
  },
  {
    node: <SiGit />,
    title: "Git",
    href: "https://git-scm.com/",
  },
  {
    node: <SiDocker />,
    title: "Docker",
    href: "https://www.docker.com/",
  },
  {
    node: <SiPostgresql />,
    title: "PostgreSQL",
    href: "https://www.postgresql.org/",
  },
  {
    node: <SiMysql />,
    title: "MySQL",
    href: "https://www.mysql.com/",
  },
  {
    node: <SiSupabase />,
    title: "Supabase",
    href: "https://www.supabase.com/",
  },
  {
    node: <SiWebpack />,
    title: "Webpack",
    href: "https://webpack.js.org/",
  },
  {
    node: <SiBabel />,
    title: "Babel",
    href: "https://babeljs.io/",
  },
  {
    node: <SiGooglecloud />,
    title: "Google Cloud",
    href: "https://cloud.google.com/",
  },
  {
    node: <SiDigitalocean />,
    title: "Digital Ocean",
    href: "https://www.digitalocean.com/",
  },
];

export function LogoLoopComponent() {
  return (
    <section className="relative mx-auto flex h-28 w-full max-w-5xl items-center overflow-hidden px-6 sm:h-40 lg:h-56">
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={44}
        gap={48}
        pauseOnHover
        scaleOnHover
        fadeOut
        ariaLabel="Technology stack"
      />
    </section>
  );
}
