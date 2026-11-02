import {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {cn} from '@/lib/utils';
import { htmlToText } from "@/lib/html-text";

type TocItem = {
  readonly id: string;
  readonly value: string;
  readonly level: number;
  readonly children?: readonly TocItem[];
};

function flatten(
  items: readonly TocItem[],
  minLevel: number,
  maxLevel: number,
): TocItem[] {
  return items.flatMap((item) =>
    item.level <= maxLevel
      ? item.level >= minLevel
        ? [item, ...flatten(item.children ?? [], minLevel, maxLevel)]
        : flatten(item.children ?? [], minLevel, maxLevel)
      : [],
  );
}

export function TableOfContents({
  headings,
  className,
  minLevel = 1,
  maxLevel = 3,
}: {
  headings: readonly TocItem[];
  className?: string;
  minLevel?: number;
  maxLevel?: number;
}) {
  const items = flatten(headings, minLevel, maxLevel);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {rootMargin: '-64px 0px -70% 0px'},
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join(',')]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={translate({
        id: 'theme.blog.toc.navAriaLabel',
        message: 'On this page',
        description: 'The ARIA label for the blog post table of contents',
      })}
      className={className}>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {translate({
          id: 'theme.blog.toc.heading',
          message: 'On this page',
          description: 'Heading for the blog post table of contents',
        })}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <Link
                to={`#${item.id}`}
                data-noBrokenLinkCheck
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'block border-l-2 py-1 text-xs transition-colors rounded-r-md',
                  item.level >= 3 ? 'pl-5' : 'pl-3',
                  active
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-dashed border-border text-muted-foreground hover:bg-muted/40',
                )}>
                {htmlToText(item.value)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
