import React, { type JSX } from "react";
import { translate } from "@docusaurus/Translate";

import { Card } from "@/components/glass/card";
import { cn } from "@/lib/utils";
import {
  earliest,
  formatDuration,
  formatYearMonth,
  latest,
  monthsBetween,
  type YearMonth,
} from "@/lib/month-range";
import type { Organisation } from "./experience";
import { RoleDetails } from "./RoleDetails";

interface TimelineEntryProps {
  organisation: Organisation;
  today: YearMonth;
  locale: string;
}

interface Span {
  range: string;
  duration: string;
  ongoing: boolean;
}

function spanFormatter(today: YearMonth, locale: string): (start: YearMonth, end: YearMonth | null) => Span {
  const present = translate({ id: "workExperience.present", message: "Present" });
  return (start: YearMonth, end: YearMonth | null): Span => ({
    range: `${formatYearMonth(start, locale)} – ${end ? formatYearMonth(end, locale) : present}`,
    duration: formatDuration(monthsBetween(start, end ?? today), locale),
    ongoing: end === null,
  });
}

/** Timeline node on the rail: ongoing work pulses, education is hollow. */
function RailNode({ ongoing, education }: { ongoing: boolean; education: boolean }): JSX.Element {
  return (
    <span aria-hidden="true" className="absolute left-1/2 top-8 grid size-3.5 -translate-x-1/2 place-items-center">
      {ongoing && (
        <span className="absolute inset-0 animate-ping rounded-full bg-(--galaxy-amber) opacity-60 motion-reduce:animate-none" />
      )}
      <span
        className={cn(
          "relative size-3.5 rounded-full ring-4 ring-(--aurora-base)",
          education ? "border-2 border-(--galaxy-teal) bg-(--aurora-base)" : "bg-(--galaxy-amber)"
        )}
      />
    </span>
  );
}

/**
 * One organisation on the experience timeline: period gutter (wide screens),
 * rail node, and a glass card listing its roles — several roles at one
 * company read as a progression on a nested rail.
 */
export function TimelineEntry({ organisation, today, locale }: TimelineEntryProps): JSX.Element {
  const span = spanFormatter(today, locale);
  const { roles } = organisation;
  const overall = span(earliest(roles.map((r) => r.start)), latest(roles.map((r) => r.end)));
  const isEducation = organisation.kind === "education";
  const hasProgression = roles.length > 1;

  return (
    <li className="grid grid-cols-1 gap-x-4 sm:grid-cols-[1.5rem_1fr] md:grid-cols-[10rem_2rem_1fr] md:gap-x-6">
      <div className="hidden pt-6 text-right md:block">
        <p className="!m-0 font-mono text-sm font-medium text-foreground">{overall.range}</p>
        <p className="!m-0 mt-1 text-xs text-muted-foreground">{overall.duration}</p>
      </div>

      <div className="relative hidden sm:block">
        <RailNode ongoing={overall.ongoing} education={isEducation} />
      </div>

      <Card className="gap-5 px-5 py-5 sm:px-7 sm:py-6">
        <header className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-control font-mono text-sm font-bold tracking-wider text-white shadow-sm",
              isEducation
                ? "bg-[linear-gradient(135deg,oklch(0.55_0.11_215),oklch(0.5_0.18_295))]"
                : "bg-[linear-gradient(135deg,oklch(0.62_0.16_50),oklch(0.55_0.2_355))]"
            )}
          >
            {organisation.monogram}
          </span>
          <div className="min-w-0">
            <h3 className="!m-0 text-lg font-semibold leading-tight tracking-tight text-foreground">
              {organisation.name}
            </h3>
            {/* the gutter shows the overall span on wide screens */}
            <p className="!m-0 mt-1 font-mono text-xs text-muted-foreground md:hidden">
              {overall.range} · {overall.duration}
            </p>
          </div>
        </header>

        {hasProgression ? (
          <ol className="!m-0 list-none space-y-6 border-l border-glass-border !pl-5">
            {roles.map((role) => {
              const roleSpan = span(role.start, role.end);
              return (
                <li key={role.title} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.6rem] top-1.5 size-2 rounded-full bg-(--galaxy-amber)"
                  />
                  <RoleDetails role={role} period={`${roleSpan.range} · ${roleSpan.duration}`} />
                </li>
              );
            })}
          </ol>
        ) : (
          // its period is the organisation's: already in the header (narrow) or gutter (wide)
          <RoleDetails role={roles[0]} />
        )}
      </Card>
    </li>
  );
}
