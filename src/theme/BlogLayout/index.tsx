import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import type {Props} from '@theme/BlogLayout';

export default function BlogLayout(props: Props): ReactNode {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = (sidebar && sidebar.items.length > 0) || Boolean(toc);

  return (
    <Layout {...layoutProps}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-16">
        {hasSidebar ? (
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-8 lg:in-[.blog-post-page]:gap-12">
            {/* Post pages: the reading column is capped, so a wider rail takes up the
                slack instead of leaving a dead gap between the text and the sidebar */}
            <main className="min-w-0 flex-1">{children}</main>
            <aside className="w-full shrink-0 space-y-10 lg:sticky lg:top-20 lg:w-56 lg:in-[.blog-post-page]:w-72 xl:in-[.blog-post-page]:w-96 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
              {toc && <div className="mb-10 hidden lg:block">{toc}</div>}
              <BlogSidebar sidebar={sidebar} />
            </aside>
          </div>
        ) : (
          <main className="min-w-0 flex-1">{children}</main>
        )}
      </div>
    </Layout>
  );
}
