import type { JSX } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { Badge } from "@/components/glass/badge";
import { Card } from "@/components/glass/card";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  Layers02Icon,
  Rocket01Icon,
} from "@/components/ui/icons";
import type { LearnTopic, Roadmap, TopicFormat } from "@/data/learn/types";

const FORMAT_ICON = {
  flow: Rocket01Icon,
  compare: Layers02Icon,
  reading: BookOpen01Icon,
} as const satisfies Record<TopicFormat, unknown>;

function formatLabel(format: TopicFormat): string {
  switch (format) {
    case "flow":
      return translate({ id: "learn.format.flow", message: "Flow" });
    case "compare":
      return translate({ id: "learn.format.compare", message: "Compare" });
    case "reading":
      return translate({ id: "learn.format.reading", message: "Reading" });
  }
}

function TopicStatus({ topic, roadmapHref }: { readonly topic: LearnTopic; readonly roadmapHref: string }) {
  if (topic.to) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-ink">
        {translate({ id: "learn.topic.open", message: "Open" })}
        <ArrowRight01Icon size={14} className="transition-transform group-hover/card:translate-x-0.5" />
      </span>
    );
  }
  if (topic.format === "reading") {
    return (
      <Link href={roadmapHref} className="inline-flex items-center gap-1 text-sm font-medium !text-primary-ink">
        roadmap.sh
        <ArrowUpRight01Icon size={14} />
      </Link>
    );
  }
  return (
    <span className="text-xs font-medium text-muted-foreground">
      {translate({ id: "learn.topic.planned", message: "Planned" })}
    </span>
  );
}

function TopicCard({ topic, roadmapHref, roadmapTitles }: {
  readonly topic: LearnTopic;
  readonly roadmapHref: string;
  readonly roadmapTitles: Readonly<Record<string, string>>;
}) {
  const Icon = FORMAT_ICON[topic.format];
  const borrowedFrom = topic.crossListFrom ? roadmapTitles[topic.crossListFrom] ?? topic.crossListFrom : null;
  const body = (
    <>
      <span className="flex items-center justify-between gap-3">
        <Badge variant={topic.to ? "tinted" : "secondary"} className="rounded-full">
          <Icon />
          {formatLabel(topic.format)}
        </Badge>
        <TopicStatus topic={topic} roadmapHref={roadmapHref} />
      </span>
      <span className="text-base font-semibold leading-snug text-foreground">{topic.title}</span>
      <span className="text-sm leading-relaxed text-muted-foreground">{topic.question}</span>
      {borrowedFrom && (
        <span className="text-xs font-medium text-muted-foreground">
          {translate({ id: "learn.topic.sharedFrom", message: "Shared from {roadmap}" }, { roadmap: borrowedFrom })}
        </span>
      )}
    </>
  );
  if (topic.to) {
    return (
      <Card asChild material="solid" size="sm" className="gap-2 px-4 hover:border-primary/40">
        <Link to={topic.to} className="!no-underline">
          {body}
        </Link>
      </Card>
    );
  }
  return (
    <Card material="solid" size="sm" elevation="flat" className="gap-2 bg-card/60 px-4">
      {body}
    </Card>
  );
}

/** One roadmap as a vertical path: numbered sections on a spine, picked topics beside each. */
export default function TopicIndex({ roadmap, roadmapTitles = {} }: {
  readonly roadmap: Roadmap;
  /** Titles by roadmap id, to name the roadmap a cross-listed topic comes from. */
  readonly roadmapTitles?: Readonly<Record<string, string>>;
}): JSX.Element {
  return (
    // div + list roles: the prose styles underline every link inside an <li>,
    // which would underline the whole topic card
    <div role="list" className="relative mt-5 mb-2">
      {roadmap.sections.map((section, index) => {
        const isLast = index === roadmap.sections.length - 1;
        const hasLive = section.topics.some((t) => t.to);
        return (
          <div role="listitem" key={section.id} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-6">
            {!isLast && (
              <span aria-hidden="true" className="absolute top-8 bottom-0 left-4 w-px -translate-x-1/2 bg-border" />
            )}
            <span
              className={clsx(
                "relative z-10 flex size-8 items-center justify-center rounded-full border font-mono text-xs font-bold tabular-nums",
                hasLive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-col gap-3 pt-1">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </span>
              {section.topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} roadmapHref={roadmap.href} roadmapTitles={roadmapTitles} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
