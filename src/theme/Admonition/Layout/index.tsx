import React, {type ReactNode} from 'react';
import {ThemeClassNames} from '@docusaurus/theme-common';
import clsx from 'clsx';

import {
  Alert02Icon,
  AlertDiamondIcon,
  NoteIcon,
  SparklesIcon,
} from '@/components/ui/icons';

const PRIMARY_TYPES = new Set([
  'note',
  'tip',
  'info',
  'secondary',
  'important',
  'success',
]);

function iconFor(type: string): ReactNode {
  if (PRIMARY_TYPES.has(type)) {
    if (type === 'tip' || type === 'success') return <SparklesIcon size={15} />;
    if (type === 'note' || type === 'secondary') return <NoteIcon size={15} />;
    return <Alert02Icon size={15} />;
  }
  return <AlertDiamondIcon size={15} />;
}

function labelFor(type: string, title?: ReactNode): ReactNode {
  const defaults: Record<string, string> = {
    note: 'Note',
    tip: 'Tip',
    info: 'Info',
    caution: 'Caution',
    danger: 'Danger',
    warning: 'Warning',
    secondary: 'Secondary',
    important: 'Important',
    success: 'Success',
  };
  if (title) {
    return title;
  }
  return defaults[type] ?? type;
}

export default function AdmonitionLayout({
  type,
  title,
  icon,
  children,
  className,
}: {
  type: string;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}): ReactNode {
  const destructive = !PRIMARY_TYPES.has(type);

  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        'my-4 rounded-lg border p-3 text-sm leading-relaxed',
        destructive
          ? 'border-destructive/40 bg-destructive/5 [&_a]:text-destructive'
          : 'border-primary/40 bg-primary/5 [&_a]:text-primary',
        '[&_code:not(pre code)]:rounded-sm [&_code:not(pre code)]:bg-background/60 [&_code:not(pre code)]:px-1 [&_code:not(pre code)]:py-0.5 [&_code:not(pre code)]:font-mono [&_code:not(pre code)]:text-[0.85em]',
        '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
        className,
      )}>
      <div
        className={clsx(
          'mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
          destructive ? 'text-destructive' : 'text-primary',
        )}>
        {icon ?? iconFor(type)}
        {labelFor(type, title)}
      </div>
      {children && (
        <div className="[&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
          {children}
        </div>
      )}
    </div>
  );
}
