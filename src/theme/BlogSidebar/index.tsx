import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useGlobalData from '@docusaurus/useGlobalData';
import {useVisibleBlogSidebarItems} from '@docusaurus/plugin-content-blog/client';
import {Badge} from '@/components/ui/badge';
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

export default function BlogSidebar({sidebar}: Props): ReactNode {
  const items = useVisibleBlogSidebarItems(sidebar?.items ?? []);

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
      aria-label={translate({
        id: 'theme.blog.sidebar.navAriaLabel',
        message: 'Blog recent posts navigation',
        description: 'The ARIA label for recent posts in the blog sidebar',
      })}>
      <div className="space-y-8">
        {hasCategories && (
          <section>
            <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <Tag01Icon size={12} />
              {translate({
                id: 'theme.blog.sidebar.categories',
                message: 'Categories',
              })}
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.permalink}
                  asChild
                  variant="outline"
                  className="gap-1.5 py-1 text-xs transition-colors hover:border-muted-foreground/50">
                  <Link to={tag.permalink}>
                    {tag.label}
                    <span className="text-muted-foreground">{tag.count}</span>
                  </Link>
                </Badge>
              ))}
            </div>
          </section>
        )}

        {hasRecentPosts && (
          <section>
            <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpen01Icon size={12} />
              {sidebar?.title ??
                translate({
                  id: 'theme.blog.sidebar.recentPosts',
                  message: 'Recent posts',
                })}
            </h4>
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.permalink}>
                  <Link
                    to={item.permalink}
                    className="group flex items-center gap-1.5 rounded-md py-2 pl-3 pr-2 text-xs leading-snug text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground">
                    <ArrowRight01Icon
                      size={12}
                      className="shrink-0 transition-transform group-hover:translate-x-0.5"
                    />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </nav>
  );
}
