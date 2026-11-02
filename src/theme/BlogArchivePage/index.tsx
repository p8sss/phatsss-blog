import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {PageMetadata, usePluralForm} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';

import {Badge} from '@/components/glass/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/glass/card';
import {ArrowRight01Icon, Calendar01Icon} from '@/components/ui/icons';

type ArchivePost = {metadata: {permalink: string; title: string; date: string}};
type YearGroup = {year: string; posts: ArchivePost[]};

function Year({year, posts}: YearGroup): ReactNode {
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  const formatDate = (lastUpdated: string | number) =>
    dateTimeFormat.format(new Date(lastUpdated));

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border !py-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Calendar01Icon size={15} className="text-muted-foreground" />
          {year}
          <Badge variant="secondary" className="ml-auto font-mono text-xs">
            {posts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* `!` utilities: Infima indents lists and colours links unlayered. */}
        <ul className="!mb-0 list-none divide-y divide-border/60 !pl-0">
          {posts.map((post) => (
            <li key={post.metadata.permalink} className="!mt-0">
              <Link
                to={post.metadata.permalink}
                className="group flex flex-col gap-0.5 px-4 py-2.5 !text-foreground !no-underline transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-3">
                <span className="shrink-0 font-mono text-xs text-muted-foreground sm:w-24">
                  {formatDate(post.metadata.date)}
                </span>
                <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium group-hover:text-primary">
                  {post.metadata.title}
                </span>
                <ArrowRight01Icon
                  size={14}
                  className="hidden shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function listPostsByYears(blogPosts: ArchivePost[]): YearGroup[] {
  const postsByYear = blogPosts.reduce((posts, post) => {
    const year = post.metadata.date.split('-')[0];
    const yearPosts = posts.get(year) ?? [];
    return posts.set(year, [post, ...yearPosts]);
  }, new Map<string, ArchivePost[]>());
  return Array.from(postsByYear, ([year, posts]) => ({
    year,
    posts,
  }));
}

export default function BlogArchive({archive}: {archive: {blogPosts: ArchivePost[]}}): ReactNode {
  const title = translate({
    id: 'theme.blog.archive.title',
    message: 'Archive',
    description: 'The page & hero title of the blog archive page',
  });
  const years = listPostsByYears(archive.blogPosts);
  const {selectMessage} = usePluralForm();
  const postCount = archive.blogPosts.length;

  return (
    <>
      <PageMetadata title={title} />
      <Layout>
        <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-16">
          <header className="mb-8 space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {selectMessage(
                postCount,
                translate(
                  {
                    id: 'theme.blog.archive.postCount',
                    message: '{count} post|{count} posts',
                    description: 'The plural label for the archive post count',
                  },
                  {count: postCount},
                ),
              )}
            </p>
          </header>
          {years.length > 0 && (
            <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {years.map((yearGroup) => (
                <Year key={yearGroup.year} {...yearGroup} />
              ))}
            </div>
          )}
        </main>
      </Layout>
    </>
  );
}
