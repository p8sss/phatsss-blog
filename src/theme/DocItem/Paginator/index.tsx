import React, {type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {PagerLink} from '@/components/ui/pager-link';

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
        <PagerLink
          permalink={previous.permalink}
          title={previous.title}
          direction="prev"
          label={
            <Translate
              id="theme.docs.paginator.previous"
              description="The label used to navigate to the previous doc">
              Previous
            </Translate>
          }
        />
      )}
      {next && (
        <PagerLink
          permalink={next.permalink}
          title={next.title}
          direction="next"
          label={
            <Translate
              id="theme.docs.paginator.next"
              description="The label used to navigate to the next doc">
              Next
            </Translate>
          }
        />
      )}
    </nav>
  );
}
