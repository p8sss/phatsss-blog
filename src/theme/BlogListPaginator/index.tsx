import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {ArrowLeft01Icon, ArrowRight01Icon} from '@/components/ui/icons';
import {buttonVariants} from '@/components/ui/button';
import type {Props} from '@theme/BlogListPaginator';

export default function BlogListPaginator(props: Props): ReactNode {
  const {metadata} = props;
  const {previousPage, nextPage} = metadata;

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-between gap-4"
      aria-label={translate({
        id: 'theme.blog.paginator.navAriaLabel',
        message: 'Blog list page navigation',
        description: 'The ARIA label for the blog pagination',
      })}>
      {previousPage && (
        <Link
          to={previousPage}
          className={buttonVariants({variant: 'outline', className: 'gap-2 px-4 py-2'})}>
          <ArrowLeft01Icon size={16} />
          <Translate
            id="theme.blog.paginator.newerEntries"
            description="The label used to navigate to the newer blog posts page (previous page)">
            Newer entries
          </Translate>
        </Link>
      )}
      {nextPage && (
        <Link
          to={nextPage}
          className={buttonVariants({
            variant: 'outline',
            className: 'ml-auto gap-2 px-4 py-2',
          })}>
          <Translate
            id="theme.blog.paginator.olderEntries"
            description="The label used to navigate to the older blog posts page (next page)">
            Older entries
          </Translate>
          <ArrowRight01Icon size={16} />
        </Link>
      )}
    </nav>
  );
}
