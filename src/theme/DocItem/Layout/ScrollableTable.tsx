import React, {useRef, type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {useHorizontalOverflow} from '@/hooks/use-horizontal-overflow';

/**
 * A markdown table in its own horizontal scroller. When the table is wider
 * than the column it becomes a focusable, labelled region (keyboard users can
 * scroll it) and its right edge fades out until scrolled to the end.
 */
export function ScrollableTable({
  className,
  ...props
}: ComponentProps<'table'>): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const {isScrollable, isAtEnd} = useHorizontalOverflow(ref);

  return (
    <div
      ref={ref}
      {...(isScrollable && {
        role: 'region',
        tabIndex: 0,
        'aria-label': translate({
          id: 'docs.table.scrollRegionLabel',
          message: 'Scrollable table',
          description: 'ARIA label of a markdown table wider than the page',
        }),
      })}
      className={clsx(
        'glass-focus my-4 overflow-x-auto rounded-md',
        isScrollable &&
          !isAtEnd &&
          '[mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)]',
      )}>
      {/* Infima makes every table its own display:block scroller; the
          wrapper scrolls instead so it can carry the region semantics */}
      <table {...props} className={clsx('!my-0 !table !overflow-visible', className)} />
    </div>
  );
}
