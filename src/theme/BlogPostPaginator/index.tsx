import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {ArrowLeft01Icon, ArrowRight01Icon} from '@/components/ui/icons';
import {buttonVariants} from '@/components/ui/button';
import type {Props} from '@theme/BlogPostPaginator';

export default function BlogPostPaginator(props: Props): ReactNode {
  const {nextItem, prevItem} = props;

  return (
    <nav
      className="mt-12 grid gap-4 sm:grid-cols-2"
      aria-label={translate({
        id: 'theme.blog.post.paginator.navAriaLabel',
        message: 'Blog post page navigation',
        description: 'The ARIA label for the blog posts pagination',
      })}>
      {prevItem && (
        <Link
          to={prevItem.permalink}
          className={buttonVariants({
            variant: 'outline',
            className:
              'group h-auto flex-col items-start gap-1.5 p-5 text-left',
          })}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft01Icon size={14} />
            <Translate
              id="theme.blog.post.paginator.newerPost"
              description="The blog post button label to navigate to the newer/previous post">
              Newer post
            </Translate>
          </span>
          <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {prevItem.title}
          </span>
        </Link>
      )}
      {nextItem && (
        <Link
          to={nextItem.permalink}
          className={buttonVariants({
            variant: 'outline',
            className:
              'group h-auto flex-col items-end gap-1.5 p-5 text-right',
          })}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Translate
              id="theme.blog.post.paginator.olderPost"
              description="The blog post button label to navigate to the older/next post">
              Older post
            </Translate>
            <ArrowRight01Icon size={14} />
          </span>
          <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {nextItem.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
