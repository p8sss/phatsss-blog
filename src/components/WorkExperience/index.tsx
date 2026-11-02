import React, { type JSX } from "react";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { Briefcase01Icon } from "@/components/ui/icons";
import { useToday } from "@/hooks/use-today";
import { toYearMonth } from "@/lib/month-range";
import SectionHeading from "../SectionHeading";
import { getOrganisations, yearsOfExperience } from "./experience";
import { TimelineEntry } from "./TimelineEntry";

export default function WorkExperience(): JSX.Element {
  const { i18n } = useDocusaurusContext();
  const today = toYearMonth(useToday());
  const organisations = getOrganisations();

  return (
    <section className="mx-auto w-full max-w-5xl px-0 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={
          <>
            <Briefcase01Icon size={14} /> {translate({ id: "workExperience.title" })}
          </>
        }
        title={translate({ id: "workExperience.title" })}
        description={translate(
          {
            id: "workExperience.description",
            message:
              "{years}+ years of experience in front-end development creating intuitive, modern, and user-friendly web applications.",
          },
          { years: yearsOfExperience(organisations, today) }
        )}
      />

      <div className="relative [--rail-x:0.75rem] md:[--rail-x:12.5rem]">
        {/* the rail, running through every node, in the galaxy accents */}
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-(--rail-x) top-8 hidden w-px sm:block -translate-x-1/2 bg-[linear-gradient(to_bottom,var(--galaxy-amber),var(--galaxy-rose)_45%,var(--galaxy-violet)_75%,var(--galaxy-teal))] opacity-60"
        />
        <ol className="!m-0 list-none space-y-8 !p-0">
          {organisations.map((organisation) => (
            <TimelineEntry key={organisation.id} organisation={organisation} today={today} locale={i18n.currentLocale} />
          ))}
        </ol>
      </div>
    </section>
  );
}
