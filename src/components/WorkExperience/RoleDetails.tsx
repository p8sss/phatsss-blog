import React, { useId, useState, type JSX } from "react";
import { translate } from "@docusaurus/Translate";

import { Badge } from "@/components/glass/badge";
import { cn } from "@/lib/utils";
import { engagementLabel, type Role } from "./experience";

interface RoleDetailsProps {
  role: Role;
  /** "Oct 2019 – Present · 7 years 1 month"; omitted when the entry already shows it */
  period?: string;
}

/** Title, engagement type, period, a clamped description and the stack. */
export function RoleDetails({ role, period }: RoleDetailsProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h4 className="!m-0 text-base font-semibold leading-snug tracking-tight text-foreground">{role.title}</h4>
        <Badge variant="tinted" className="rounded-full px-2.5 text-xs font-semibold uppercase tracking-wide">
          {engagementLabel(role.type)}
        </Badge>
      </div>
      {period && <p className="!m-0 font-mono text-xs text-muted-foreground">{period}</p>}

      <div>
        <p
          id={descriptionId}
          className={cn("!m-0 text-[0.95rem] leading-relaxed text-foreground/85", !expanded && "line-clamp-3")}
        >
          {role.description}
        </p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((value) => !value)}
          className="glass-focus mt-1.5 inline-flex min-h-6 items-center rounded-sm text-sm font-medium text-primary hover:underline hover:underline-offset-4"
        >
          {expanded
            ? translate({ id: "workExperience.showLess", message: "Show less" })
            : translate({ id: "workExperience.showMore", message: "Show more" })}
        </button>
      </div>

      {role.stack.length > 0 && (
        <ul
          aria-label={translate({ id: "workExperience.stack", message: "Technologies" })}
          className="!m-0 flex list-none flex-wrap gap-1.5 !p-0"
        >
          {role.stack.map((tech) => (
            <li key={tech}>
              <Badge variant="outline" className="rounded-full px-2.5 font-mono text-xs text-muted-foreground">
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
