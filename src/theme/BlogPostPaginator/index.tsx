import React, {type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {PagerLink} from '@/components/ui/pager-link';
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
        <PagerLink
          permalink={prevItem.permalink}
          title={prevItem.title}
          direction="prev"
          label={
            <Translate
              id="theme.blog.post.paginator.newerPost"
              description="The blog post button label to navigate to the newer/previous post">
              Newer post
            </Translate>
          }
        />
      )}
      {nextItem && (
        <PagerLink
          permalink={nextItem.permalink}
          title={nextItem.title}
          direction="next"
          label={
            <Translate
              id="theme.blog.post.paginator.olderPost"
              description="The blog post button label to navigate to the older/next post">
              Older post
            </Translate>
          }
        />
      )}
    </nav>
  );
}
