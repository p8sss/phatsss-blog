import React, {type ReactNode, useMemo, useState} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';

import {useBlogData, type PostSummary} from '@/lib/blogData';
import {Search01Icon, FireIcon} from '@/components/ui/icons';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card} from '@/components/ui/card';
import {PostCard} from '@/components/blog/PostCard';
import {FeaturedPostCard} from '@/components/blog/FeaturedPostCard';

const PAGE_SIZE = 6;

function matchesQuery(post: PostSummary, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    post.title,
    post.description,
    post.excerpt,
    ...post.tags.map((t) => t.label),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, sidebar} = props;
  const {blogPosts, blogTags} = useBlogData();
  const posts = useMemo<PostSummary[]>(
    () => (blogPosts ?? []).slice().sort((a, b) => b.date.localeCompare(a.date)),
    [blogPosts],
  );

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const tags = Object.values(blogTags ?? {}).sort((a, b) => b.count - a.count);
    return ['All', ...tags.map((t) => t.label)];
  }, [blogTags]);

  const showFeatured = query.trim() === '' && activeCategory === 'All';

  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (activeCategory === 'All' ||
            post.tags.some((t) => t.label === activeCategory)) &&
          matchesQuery(post, query),
      ),
    [posts, activeCategory, query],
  );

  const featured = showFeatured ? filtered[0] : undefined;
  const gridItems = featured ? filtered.slice(1) : filtered;
  const visibleItems = gridItems.slice(0, visibleCount);
  const hasMore = visibleCount < gridItems.length;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <BlogLayout sidebar={sidebar}>
      {/* Page header + live search */}
      <header className="mb-10">
        <h1 className="!mb-3 !text-3xl !font-semibold tracking-tight sm:!text-4xl">
          {metadata.blogTitle}
        </h1>
        {metadata.blogDescription && (
          <p className="!mb-0 text-lg text-muted-foreground">
            {metadata.blogDescription}
          </p>
        )}

        <div className="relative mt-6 max-w-md">
          <Search01Icon
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={translate({
              id: 'blog.list.searchPlaceholder',
              message: 'Search articles…',
            })}
            className="bg-card pl-9"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category)}
              className="cursor-pointer gap-1.5 rounded-full px-3 text-xs font-medium">
              {category === 'All' && <FireIcon size={13} />}
              {category}
            </Button>
          ))}
        </div>
      </header>

      {/* Featured article */}
      {featured && (
        <div className="mb-10">
          <FeaturedPostCard post={featured} />
        </div>
      )}

      {/* Article grid */}
      {visibleItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((post) => (
            <PostCard key={post.permalink} post={post} />
          ))}
        </div>
      ) : (
        <Card className="items-center border-dashed py-20 text-center shadow-none">
          <Search01Icon size={24} className="text-muted-foreground" />
          <p className="font-medium text-foreground">
            {translate({
              id: 'blog.list.noResults',
              message: 'No articles found',
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {translate({
              id: 'blog.list.tryAdjusting',
              message: 'Try adjusting your search or filters.',
            })}
          </p>
        </Card>
      )}

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="cursor-pointer px-5 py-2.5">
            {translate({
              id: 'blog.list.loadMore',
              message: 'Load more articles',
            })}
          </Button>
        </div>
      )}
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
