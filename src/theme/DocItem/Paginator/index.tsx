import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {ArrowLeft01Icon, ArrowRight01Icon} from '@/components/ui/icons';
import {buttonVariants} from '@/components/glass/button';

export default function DocItemPaginator(): ReactNode {
  const {metadata} = useDoc();
  const {previous, next} = metadata;

  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      className="mt-12 grid gap-4 sm:grid-cols-2"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}>
      {previous && (
        <Link
          to={previous.permalink}
          className={buttonVariants({
            variant: 'outline',
            className: 'group h-auto flex-col items-start gap-1.5 p-5 text-left',
          })}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft01Icon size={14} />
            {translate({
              id: 'theme.docs.paginator.previous',
              message: 'Previous',
              description:
                'The label used to navigate to the previous doc',
            })}
          </span>
          <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {previous.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          to={next.permalink}
          className={buttonVariants({
            variant: 'outline',
            className: 'group h-auto flex-col items-end gap-1.5 p-5 text-right',
          })}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {translate({
              id: 'theme.docs.paginator.next',
              message: 'Next',
              description: 'The label used to navigate to the next doc',
            })}
            <ArrowRight01Icon size={14} />
          </span>
          <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
