import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {badgeVariants} from '@/components/glass/badge';
import type {Props} from '@theme/Tag';

export default function Tag({
  permalink,
  label,
  count,
  description,
}: Props): ReactNode {
  return (
    <Link
      rel="tag"
      // data-slot opts the link out of Infima's link colour (see chrome.css).
      data-slot="badge"
      href={permalink}
      title={description}
      className={clsx(
        badgeVariants({variant: 'outline'}),
        'gap-1.5 py-1 text-xs transition-colors hover:border-muted-foreground/50',
      )}>
      {label}
      {count !== undefined && (
        <span className="text-muted-foreground">{count}</span>
      )}
    </Link>
  );
}
