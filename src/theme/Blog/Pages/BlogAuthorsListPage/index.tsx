import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {translateBlogAuthorsListPageTitle} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';

import {Badge} from '@/components/glass/badge';
import {Card} from '@/components/glass/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/glass/avatar';

type Author = {
  key: string;
  name: string;
  title?: string;
  url?: string;
  imageURL?: string;
  count: number;
  page?: {permalink: string};
};

function AuthorCard({author}: {author: Author}): ReactNode {
  const initials = author.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const body = (
    <div className="flex items-center gap-3">
      <Avatar className="size-11 border">
        <AvatarImage src={author.imageURL} alt={author.name} />
        <AvatarFallback className="text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {author.name}
        </p>
        {author.title && (
          <p className="truncate text-xs text-muted-foreground">
            {author.title}
          </p>
        )}
      </div>
      <Badge variant="secondary" className="shrink-0 font-mono text-[11px]">
        {author.count}
      </Badge>
    </div>
  );

  return (
    <Card asChild className="group py-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {author.page ? (
        <Link to={author.page.permalink} aria-label={author.name}>
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
    </Card>
  );
}

export default function BlogAuthorsListPage({
  authors,
  sidebar,
}: {
  authors: Author[];
  sidebar?: Parameters<typeof BlogLayout>[0]['sidebar'];
}): ReactNode {
  const title = translateBlogAuthorsListPageTitle();
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogAuthorsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_authors_list" />
      <BlogLayout sidebar={sidebar}>
        <header className="mb-8 space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {translate(
              {
                id: 'theme.blog.authors.authorCount',
                message: '{count} author|{count} authors',
                description: 'The plural label for the authors list page',
              },
              {count: authors.length},
            )}
          </p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {authors.map((author) => (
            <AuthorCard key={author.key} author={author} />
          ))}
        </section>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
