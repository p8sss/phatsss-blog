import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {ArrowLeft01Icon, ArrowRight01Icon} from '@/components/ui/icons';

interface PagerLinkProps {
  permalink: string;
  title: string;
  /** Direction label shown above the title ("Previous", "Older post", …). */
  label: ReactNode;
  direction: 'prev' | 'next';
}

/** A glass card per neighbour page: direction label over the title. Next sits in the right column. */
export function PagerLink({permalink, title, label, direction}: PagerLinkProps): ReactNode {
  const isNext = direction === 'next';
  const Arrow = isNext ? ArrowRight01Icon : ArrowLeft01Icon;
  return (
    <Link
      to={permalink}
      data-slot="pager-link"
      className={clsx(
        'glass glass-press glass-focus group relative flex min-h-24 flex-col justify-center gap-2 rounded-surface px-6 py-5 [--glass-elevation:0_0_#0000] transition-[border-color,scale] duration-(--glass-duration) hover:border-primary/40',
        isNext && 'items-end text-right sm:col-start-2',
      )}>
      <span
        className={clsx(
          'flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground',
          isNext && 'flex-row-reverse',
        )}>
        <Arrow
          size={14}
          className={clsx(
            'transition-transform duration-(--glass-duration)',
            isNext ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5',
          )}
        />
        {label}
      </span>
      <span className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {title}
      </span>
    </Link>
  );
}
