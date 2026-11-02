import React, {type ReactNode, useMemo} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useBlogTagsPostsPageTitle} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import Tag from '@theme/Tag';
import {Badge} from '@/components/glass/badge';
import {Card} from '@/components/glass/card';
import {ArrowRight01Icon, Tag01Icon} from '@/components/ui/icons';
import {PostCard} from '@/components/blog/PostCard';
import {useBlogData, type PostSummary} from '@/lib/blogData';
import type {Props} from '@theme/BlogTagsPostsPage';
import Unlisted from '@theme/ContentVisibility/Unlisted';
import Heading from '@theme/Heading';

const RELATED_TAG_LIMIT = 6;

type TagItem = Props['items'][number];

/** Fallback when a post is missing from the blog-tags global data. */
function toPostSummary({content}: TagItem): PostSummary {
  const {metadata} = content;
  const [author] = metadata.authors;
  return {
    slug: metadata.permalink,
    title: metadata.title,
    permalink: metadata.permalink,
    date: String(metadata.date),
    description: metadata.description,
    excerpt: metadata.description,
    tags: metadata.tags.map(({label, permalink}) => ({label, permalink})),
    language: 'en',
    readingTime: metadata.readingTime ?? 0,
    author: author && {
      name: author.name,
      title: author.title,
      imageURL: author.imageURL,
    },
  };
}

function useTagPosts(items: Props['items']): PostSummary[] {
  const {blogPosts} = useBlogData();
  return useMemo(() => {
    const byPermalink = new Map(
      (blogPosts ?? []).map((post) => [post.permalink, post]),
    );
    return items.map(
      (item) =>
        byPermalink.get(item.content.metadata.permalink) ?? toPostSummary(item),
    );
  }, [blogPosts, items]);
}

/** Fills the empty grid cells next to a lone result with somewhere to go next. */
function KeepExploringCard({tag}: {tag: Props['tag']}): ReactNode {
  const {blogTags} = useBlogData();
  const relatedTags = Object.values(blogTags ?? {})
    .filter((other) => other.permalink !== tag.permalink)
    .sort((a, b) => b.count - a.count)
    .slice(0, RELATED_TAG_LIMIT);

  return (
    <Card className="justify-center gap-4 border-dashed p-6 shadow-none md:col-span-1 lg:col-span-2 lg:p-8">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
        <Tag01Icon size={18} />
      </span>
      <div className="space-y-1.5">
        <p className="!mb-0 text-lg font-semibold tracking-tight text-foreground">
          {translate({
            id: 'theme.blog.tagPage.keepExploring',
            message: 'Keep exploring',
            description: 'Heading of the card shown next to a single tagged post',
          })}
        </p>
        <p className="!mb-0 text-sm text-muted-foreground">
          {translate(
            {
              id: 'theme.blog.tagPage.onlyPost',
              message: 'This is the only post tagged “{tag}” so far. Try another topic:',
              description: 'Body of the card shown next to a single tagged post',
            },
            {tag: tag.label},
          )}
        </p>
      </div>
      {relatedTags.length > 0 && (
        <ul className="!mb-0 flex list-none flex-wrap gap-2 !pl-0">
          {relatedTags.map((related) => (
            <li key={related.permalink} className="!mt-0">
              <Tag
                label={related.label}
                permalink={related.permalink}
                count={related.count}
                description={undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function BlogTagsPostsPageMetadata({tag}: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  return (
    <>
      <PageMetadata title={title} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  );
}

function BlogTagsPostsPageContent({
  tag,
  items,
  sidebar,
  listMetadata,
}: Props): ReactNode {
  const title = useBlogTagsPostsPageTitle(tag);
  const posts = useTagPosts(items);
  const isSingleResult = listMetadata.totalCount === 1;
  return (
    <BlogLayout sidebar={sidebar}>
      {tag.unlisted && <Unlisted />}
      <header className="mb-10">
        <Badge variant="outline" className="mb-4 gap-1.5 py-1">
          <Tag01Icon size={13} />
          {tag.label}
        </Badge>
        <Heading as="h1" className="!mb-3 !text-3xl !font-semibold tracking-tight sm:!text-4xl">
          {title}
        </Heading>
        {tag.description && (
          <p className="!mb-0 text-lg text-muted-foreground">
            {tag.description}
          </p>
        )}
        <Link
          href={tag.allTagsPath}
          className="group -mx-2 mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium !text-muted-foreground !no-underline transition-colors hover:!text-primary">
          <Translate
            id="theme.tags.tagsPageLink"
            description="The label of the link targeting the tag list page">
            View All Tags
          </Translate>
          <ArrowRight01Icon
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>
      {/* PostCard titles are h3; keep the outline h1 → h2 → h3 */}
      <h2 className="sr-only">
        {translate({
          id: 'theme.blog.tagTitle.postsHeading',
          message: 'Posts',
          description: 'Visually hidden heading above the tagged posts grid',
        })}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.permalink} post={post} />
        ))}
        {isSingleResult && <KeepExploringCard tag={tag} />}
      </div>
      <BlogListPaginator metadata={listMetadata} />
    </BlogLayout>
  );
}
export default function BlogTagsPostsPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage,
      )}>
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
