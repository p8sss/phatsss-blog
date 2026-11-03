import type { JSX } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { ArrowUpRight01Icon } from "@/components/ui/icons";
import type { Roadmap } from "@/data/learn/types";
import TopicIndex from "./TopicIndex";

function topicCounts(roadmap: Roadmap) {
  const topics = roadmap.sections.flatMap((s) => s.topics);
  return { total: topics.length, ready: topics.filter((t) => t.to).length };
}

function readyLabel(ready: number, total: number): string {
  return translate(
    { id: "learn.overview.ready", message: "{ready} of {total} ready" },
    { ready, total },
  );
}

/** Jump links to each roadmap, in the overview's reading order. */
function RoadmapJumpNav({ roadmaps }: { readonly roadmaps: readonly Roadmap[] }) {
  return (
    <nav
      aria-label={translate({ id: "learn.overview.jumpLabel", message: "Roadmaps on this page" })}
      className="my-6 flex flex-wrap gap-2"
    >
      {roadmaps.map((roadmap, index) => {
        const { ready, total } = topicCounts(roadmap);
        return (
          <a
            key={roadmap.id}
            href={`#${roadmap.id}`}
            className="glass-focus group inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 ps-1.5 pe-3.5 text-sm !no-underline transition-colors hover:border-primary/40 hover:bg-fill"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-fill font-mono text-[11px] font-bold tabular-nums text-muted-foreground group-hover:text-foreground">
              {index + 1}
            </span>
            <span className="font-semibold text-foreground">{roadmap.title}</span>
            <span className="text-xs text-muted-foreground">{readyLabel(ready, total)}</span>
          </a>
        );
      })}
    </nav>
  );
}

/** The Learn overview: every roadmap in order, each as its own section path. */
export default function LearnOverview({ roadmaps }: { readonly roadmaps: readonly Roadmap[] }): JSX.Element {
  const roadmapTitles = Object.fromEntries(roadmaps.map((r) => [r.id, r.title]));
  return (
    <>
      <RoadmapJumpNav roadmaps={roadmaps} />
      {roadmaps.map((roadmap) => {
        const { ready, total } = topicCounts(roadmap);
        const headingId = roadmap.id;
        return (
          <section key={roadmap.id} aria-labelledby={headingId}>
            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id={headingId} className="!m-0 scroll-mt-24">
                {roadmap.title}
              </h2>
              <span className="flex items-center gap-3 text-sm text-muted-foreground">
                {readyLabel(ready, total)}
                <Link href={roadmap.href} className="inline-flex items-center gap-1 font-medium !text-primary-ink">
                  roadmap.sh
                  <ArrowUpRight01Icon size={14} />
                </Link>
              </span>
            </div>
            <TopicIndex roadmap={roadmap} roadmapTitles={roadmapTitles} />
          </section>
        );
      })}
    </>
  );
}
