import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {MDXProvider} from '@mdx-js/react';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import {PROSE_CLASSES} from '@/lib/prose';
import type {Props} from '@theme/DocItem/Layout';
import {ScrollableTable} from './ScrollableTable';

/** Merged under the theme's MDXComponents (which has no `table`). */
const DOC_MDX_COMPONENTS = {table: ScrollableTable};

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  return (
    // The right TOC only joins at 1200px: beside the docs sidebar any earlier
    // it squeezes the article below ~600px; until then the chip TOC shows
    <div className="flex flex-col gap-8 min-[1200px]:flex-row min-[1200px]:items-start">
      <div className={clsx('min-w-0 flex-1')}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className="mx-auto w-full max-w-3xl">
          <article className={PROSE_CLASSES}>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <MDXProvider components={DOC_MDX_COMPONENTS}>
              <DocItemContent>{children}</DocItemContent>
            </MDXProvider>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && (
        <div className="hidden w-56 shrink-0 min-[1200px]:block">{docTOC.desktop}</div>
      )}
    </div>
  );
}
