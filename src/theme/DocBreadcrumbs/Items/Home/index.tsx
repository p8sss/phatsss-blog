import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import {Home01Icon} from '@/components/ui/icons';
import {BreadcrumbItem, BreadcrumbLink} from '@/components/ui/breadcrumb';

export default function HomeBreadcrumbItem(): ReactNode {
  const homeHref = useBaseUrl('/');

  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link
          aria-label={translate({
            id: 'theme.docs.breadcrumbs.home',
            message: 'Home page',
            description: 'The ARIA label for the home page in the breadcrumbs',
          })}
          href={homeHref}
          className="flex items-center gap-1">
          <Home01Icon size={14} />
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
