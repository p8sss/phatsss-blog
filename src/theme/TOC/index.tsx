import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/TOC';

import {TableOfContents} from '@/components/blog/TableOfContents';

export default function TOC({
  toc,
  minHeadingLevel,
  maxHeadingLevel,
  className,
}: Props): React.JSX.Element {
  return (
    <TableOfContents
      headings={toc}
      minLevel={minHeadingLevel ?? 2}
      maxLevel={maxHeadingLevel ?? 3}
      // dark: muted links sit straight on the nebula (no pane behind them),
      // so lift the inactive ones and the heading above 4.5:1
      className={clsx(
        'dark:[&_a:not([aria-current])]:text-foreground/85 dark:[&_p]:text-foreground/80',
        className,
      )}
    />
  );
}
