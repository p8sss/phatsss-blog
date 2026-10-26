import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {usePluralForm} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {
  ArrowRight01Icon,
  Calendar01Icon,
  Clock01Icon,
} from '@/components/ui/icons';
import {formatReadingTime, useFormatDate} from '@/lib/format';
import {PROSE_CLASSES} from '@/lib/prose';
import {CoverArt} from '@/components/blog/covers';
import {AuthorBadge} from '@/components/blog/AuthorBadge';
import {BookmarkButton} from '@/components/blog/BookmarkButton';
import type {Props} from '@theme/BlogPostItem';

function useReadingTimeLabel() {
  const {selectMessage} = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        {readingTime},
      ),
    );
  };
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {metadata, isBlogPostPage, toc} = useBlogPost();
  const {
    permalink,
    title,
    date,
    readingTime,
    tags,
    hasTruncateMarker,
    authors,
  } = metadata;

  const readingTimeLabel = useReadingTimeLabel();
  const formatDate = useFormatDate();
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const formattedDate = dateTimeFormat.format(new Date(date));

  const truncatedPost = !isBlogPostPage && hasTruncateMarker;
  const author = authors?.[0];

  if (isBlogPostPage) {
    return (
      <article className={clsx('max-w-none', className)}>
        <header className="mb-6 space-y-2 border-b pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tags[0]?.label ??
                translate({
                  id: 'theme.blog.post.uncategorized',
                  message: 'Article',
                })}
            </p>
            <h1 className="!mb-0 !text-xl !font-semibold tracking-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <AuthorBadge
                author={
                  author
                    ? {
                        name: author.name,
                        title: author.title,
                        imageURL: author.imageURL,
                      }
                    : undefined
                }
              />
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar01Icon size={15} />
                {formattedDate}
              </span>
              {typeof readingTime !== 'undefined' && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock01Icon size={15} />
                  {readingTimeLabel(readingTime)}
                </span>
              )}
              <span className="ml-auto">
                <BookmarkButton permalink={permalink} size={15} label="Save" />
              </span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => (
                  <Badge key={tag.permalink} asChild variant="outline">
                    <Link to={tag.permalink}>{tag.label}</Link>
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Mobile/tablet quick-nav jump pills */}
          {toc.length > 0 && (
            <div className="mb-8 lg:hidden">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {translate({
                  id: 'theme.blog.toc.heading',
                  message: 'On this page',
                  description: 'Heading for the blog post table of contents',
                })}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {toc.map((item) => (
                  <Link
                    key={item.id}
                    to={`#${item.id}`}
                    data-noBrokenLinkCheck
                    className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                    {item.value}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <article className={clsx('max-w-none', PROSE_CLASSES, className)}>
            {children}
          </article>
      </article>
    );
  }

  // List view — gradient cover card (shadcn Card)
  return (
    <Card
      asChild
      className={clsx(
        'group relative h-full gap-0 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg',
        className,
      )}>
      <article>
        <Link to={permalink} className="block">
          <CoverArt permalink={permalink} className="aspect-[16/9]">
            <span className="absolute top-3 left-3 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {formatDate(date)}
            </span>
          </CoverArt>
        </Link>

        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <h2 className="!mb-0 !text-base !font-semibold leading-snug tracking-tight">
            <Link
              to={permalink}
              className="!text-foreground transition-colors group-hover:!text-primary">
              {title}
            </Link>
          </h2>

          <div className="line-clamp-3 text-sm leading-relaxed text-muted-foreground markdown">
            {children}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag.permalink}
                  asChild
                  variant="outline"
                  className="bg-muted/50 text-[11px] font-medium text-muted-foreground">
                  <Link to={tag.permalink}>{tag.label}</Link>
                </Badge>
              ))}
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
              <Clock01Icon size={13} />
              {formatReadingTime(readingTime ?? 1)}
            </span>
          </div>

          {truncatedPost && (
            <Link
              to={permalink}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:!text-primary">
              {translate({
                id: 'theme.blog.post.readMore',
                message: 'Read more',
              })}
              <ArrowRight01Icon
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>

        <BookmarkButton
          permalink={permalink}
          size={14}
          className="absolute top-2.5 right-2.5 border-0 bg-black/25 px-2 py-1 text-white backdrop-blur-sm hover:bg-black/25 hover:text-white"
          label={undefined}
        />
      </article>
    </Card>
  );
}

