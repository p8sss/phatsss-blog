import React from 'react';
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
      className={className}
    />
  );
}
