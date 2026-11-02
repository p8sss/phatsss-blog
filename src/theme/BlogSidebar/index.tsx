import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import useGlobalData from '@docusaurus/useGlobalData';
import {useVisibleBlogSidebarItems} from '@docusaurus/plugin-content-blog/client';
import {Badge} from '@/components/glass/badge';
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Tag01Icon,
} from '@/components/ui/icons';
import type {Props} from '@theme/BlogSidebar';

type BlogTag = {
  label: string;
  permalink: string;
  count: number;
};

const stripTrailingSlash = (path: string) => path.replace(/\/+$/, '');

/** True on `permalink` itself and its paginated pages (`…/page/2`). */
function isCurrentPath(pathname: string, permalink: string): boolean {
  const current = stripTrailingSlash(pathname);
  const target = stripTrailingSlash(permalink);
  return current === target || current.startsWith(`${target}/page/`);
}

export default function BlogSidebar({sidebar}: Props): ReactNode {
  const items = useVisibleBlogSidebarItems(sidebar?.items ?? []);
  const {pathname} = useLocation();

  const globalData = useGlobalData();
  type BlogTagsData = {
    'docusaurus-blog-tags'?: {
      default?: {blogTags?: Record<string, BlogTag>};
    };
  };
  const blogTags = (globalData as BlogTagsData)?.['docusaurus-blog-tags']
    ?.default?.blogTags;
  const tags = blogTags
    ? Object.values(blogTags).sort((a, b) => b.count - a.count)
    : [];

  const hasCategories = tags.length > 0;
  const hasRecentPosts = items.length > 0;

  if (!hasCategories && !hasRecentPosts) {
    return null;
  }

  return (
    <nav
      // The tags index already lists every tag, so on small screens (where the
      // sidebar stacks under the content) it only adds scroll.
      className="in-[.blog-tags-list-page]:max-lg:hidden"
      aria-label={translate({
        id: 'theme.blog.sidebar.navAriaLabel',
        message: 'Blog recent posts navigation',
        description: 'The ARIA label for recent posts in the blog sidebar',
      })}>
      <div className="space-y-8">
        {hasCategories && (
          <section>
            <h2 className="!mb-3 flex items-center gap-1.5 !text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Tag01Icon size={12} />
              {translate({
                id: 'theme.blog.sidebar.categories',
                message: 'Categories',
              })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isCurrent = isCurrentPath(pathname, tag.permalink);
                return (
                  <Badge
                    key={tag.permalink}
                    asChild
                    variant={isCurrent ? 'default' : 'outline'}
                    className={
                      isCurrent
                        ? 'gap-1.5 border border-transparent py-1 text-xs'
                        : 'gap-1.5 py-1 text-xs transition-colors hover:border-muted-foreground/50'
                    }>
                    <Link
                      to={tag.permalink}
                      aria-current={isCurrent ? 'page' : undefined}>
                      {tag.label}
                      <span
                        className={
                          isCurrent
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                        }>
                        {tag.count}
                      </span>
                    </Link>
                  </Badge>
                );
              })}
            </div>
          </section>
        )}

        {hasRecentPosts && (
          <section>
            <h2 className="!mb-3 flex items-center gap-1.5 !text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpen01Icon size={12} />
              {sidebar?.title ??
                translate({
                  id: 'theme.blog.sidebar.recentPosts',
                  message: 'Recent posts',
                })}
            </h2>
            {/* Infima indents and colours lists/links with unlayered rules,
                hence the `!` utilities. */}
            <ul className="!-mx-2 !mb-0 list-none space-y-0.5 !pl-0">
              {items.map((item) => {
                const isCurrent = isCurrentPath(pathname, item.permalink);
                return (
                  <li key={item.permalink} className="!mt-0">
                    <Link
                      to={item.permalink}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={clsx(
                        'group flex items-center gap-1.5 rounded-md px-2 py-2 text-[0.8125rem] leading-snug !no-underline transition-colors hover:bg-muted/40 hover:!text-foreground',
                        isCurrent
                          ? 'bg-muted/50 font-medium !text-foreground'
                          : '!text-foreground/80',
                      )}>
                      <ArrowRight01Icon
                        size={12}
                        className="shrink-0 transition-transform group-hover:translate-x-0.5"
                      />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </nav>
  );
}
