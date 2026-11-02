import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {
  BlogPostProvider,
  useBlogPost,
  useBlogMetadata,
} from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import BlogPostPageStructuredData from '@theme/BlogPostPage/StructuredData';
import ContentVisibility from '@theme/ContentVisibility';
import {ChevronRightIcon} from '@/components/ui/icons';
import {LanguageSwitcher} from '@/components/blog/LanguageSwitcher';
import {TableOfContents} from '@/components/blog/TableOfContents';
import type {Props} from '@theme/BlogPostPage';

function BlogPostPageContent({
  sidebar,
  children,
}: {
  sidebar?: Props['sidebar'];
  children: ReactNode;
}): ReactNode {
  const {metadata, toc, frontMatter} = useBlogPost();
  const {nextItem, prevItem} = metadata;
  const {blogBasePath} = useBlogMetadata();

  const firstTag = metadata.tags[0];
  const hideToc = frontMatter.hide_table_of_contents === true;

  return (
    <BlogLayout
      sidebar={sidebar}
      toc={
        !hideToc && toc.length > 0 ? (
          <TableOfContents headings={toc} />
        ) : undefined
      }>
      <ContentVisibility metadata={metadata} />

      {/* one reading column: header, body, code and pager share the same edges */}
      <div className="max-w-[42rem]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              to={blogBasePath}
              className="inline-flex min-h-6 shrink-0 items-center font-medium transition-colors hover:!text-primary">
              Blog
            </Link>
            {firstTag && (
              <>
                <ChevronRightIcon size={14} className="shrink-0" />
                <Link
                  to={firstTag.permalink}
                  className="inline-flex min-h-6 shrink-0 items-center font-medium transition-colors hover:!text-primary">
                  {firstTag.label}
                </Link>
              </>
            )}
            <ChevronRightIcon size={14} className="shrink-0" />
            <span className="truncate text-foreground/80">
              {metadata.title}
            </span>
          </nav>
          <LanguageSwitcher />
        </div>

        <BlogPostItem>{children}</BlogPostItem>

        {(nextItem || prevItem) && (
          <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
        )}
      </div>
    </BlogLayout>
  );
}

export default function BlogPostPage(props: Props): ReactNode {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
