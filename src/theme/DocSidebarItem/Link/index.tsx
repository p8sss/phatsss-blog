import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {ArrowUpRight01Icon} from '@/components/ui/icons';
import type {Props} from '@theme/DocSidebarItem/Link';

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'flex items-center rounded-md px-3 py-1.5 transition-colors',
          level > 1 && 'pl-7',
          isActive
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-foreground/80 hover:bg-muted hover:text-foreground',
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {label}
        {!isInternalLink && (
          <ArrowUpRight01Icon size={13} className="ml-1.5 shrink-0 opacity-60" />
        )}
      </Link>
    </li>
  );
}
