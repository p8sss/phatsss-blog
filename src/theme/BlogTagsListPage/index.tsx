import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  translateTagsPageTitle,
  listTagsByLetters,
  usePluralForm,
  type TagLetterEntry,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import Tag from '@theme/Tag';
import {Badge} from '@/components/glass/badge';
import {Tag01Icon} from '@/components/ui/icons';
import type {Props} from '@theme/BlogTagsListPage';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';

function LetterGroup({letter, tags}: TagLetterEntry): ReactNode {
  return (
    <section className="mb-6 break-inside-avoid">
      {/* The hash link Heading appends is a tiny "#": give it a ≥24px hit area. */}
      <Heading
        as="h2"
        id={letter}
        className="!mb-2.5 flex items-center border-b border-border/60 pb-1.5 !text-sm !font-semibold tracking-wide [&_.hash-link]:inline-flex [&_.hash-link]:min-h-7 [&_.hash-link]:min-w-7 [&_.hash-link]:items-center [&_.hash-link]:justify-center">
        {letter}
      </Heading>
      <ul className="!mb-0 flex list-none flex-wrap gap-2 !pl-0">
        {tags.map((tag) => (
          <li key={tag.permalink} className="!mt-0">
            <Tag {...tag} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BlogTagsListPage({tags, sidebar}: Props): ReactNode {
  const title = translateTagsPageTitle();
  const {selectMessage} = usePluralForm();
  const letterGroups = listTagsByLetters(tags);
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagsListPage,
      )}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_list" />
      <BlogLayout sidebar={sidebar}>
        <header className="mb-10">
          <Badge variant="outline" className="mb-4 gap-1.5 bg-muted/50 py-1">
            <Tag01Icon size={14} />
            {selectMessage(
              tags.length,
              translate(
                {
                  id: 'theme.blog.tagsPage.tagCount',
                  message: '{count} tag|{count} tags',
                  description: 'The plural label for the number of tags on the tags index',
                },
                {count: tags.length},
              ),
            )}
          </Badge>
          <Heading as="h1" className="!mb-0 !text-3xl !font-semibold tracking-tight sm:!text-4xl">
            {title}
          </Heading>
        </header>
        <div className="columns-2 gap-x-8 sm:columns-3">
          {letterGroups.map((group) => (
            <LetterGroup key={group.letter} {...group} />
          ))}
        </div>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
