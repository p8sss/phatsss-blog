import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/glass/badge";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto mb-12 max-w-2xl text-center", className)}>
      {eyebrow && (
        <Badge
          variant="outline"
          className="mb-4 gap-1.5 rounded-full bg-muted/50 px-3 py-1 font-medium">
          {eyebrow}
        </Badge>
      )}
      <h2 className="!text-3xl font-semibold tracking-tight sm:!text-4xl">
        {title}
      </h2>
      {description && (
        <p className="!mb-0 mt-4 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
