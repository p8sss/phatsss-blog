import type { CSSProperties, JSX } from "react";
import { Card } from "@/components/glass/card";
import { cn } from "@/lib/utils";
import type { Service } from "./services";
import styles from "./services.module.css";

interface ServiceCardProps {
  readonly service: Service;
  /** 1-based position, shown as the card's index. */
  readonly position: number;
  /** The first service: a 2×2 feature on large screens. */
  readonly featured: boolean;
}

export function ServiceCard({ service, position, featured }: ServiceCardProps): JSX.Element {
  const Icon = service.icon;
  return (
    <Card
      style={{ "--service-hue": service.hue } as CSSProperties}
      className={cn(
        styles.card,
        featured && styles.featured,
        "group relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 p-4 sm:flex sm:gap-4 sm:p-6",
        featured && "lg:col-span-2 lg:row-span-2 lg:justify-end lg:gap-5 lg:p-10"
      )}
    >
      <div aria-hidden="true" className={styles.backdrop} />
      <div aria-hidden="true" className={styles.edge} />
      {featured && (
        <Icon aria-hidden="true" size={300} strokeWidth={0.5} className={cn(styles.watermark, "hidden lg:block")} />
      )}
      <span aria-hidden="true" className={cn(styles.index, "hidden sm:block")}>
        {String(position).padStart(2, "0")}
      </span>
      <div
        className={cn(
          styles.tile,
          "relative row-span-2 flex size-10 items-center justify-center rounded-lg border sm:size-11",
          featured && "lg:mb-auto lg:size-14 lg:rounded-xl"
        )}
      >
        <Icon size={featured ? 26 : 22} />
      </div>
      <h3 className={cn("relative !mb-0 !text-base !font-semibold tracking-tight sm:!text-lg", featured && "lg:!text-3xl")}>
        {service.title}
      </h3>
      <p
        className={cn(
          "relative !mb-0 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted-foreground sm:line-clamp-none sm:text-sm",
          featured && "lg:max-w-lg lg:text-base"
        )}
      >
        {service.description}
      </p>
    </Card>
  );
}
