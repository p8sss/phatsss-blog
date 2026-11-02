import Link from '@docusaurus/Link';
import type {PostSummary} from '@/lib/blogData';
import {formatReadingTime, useFormatDate} from '@/lib/format';
import {Clock01Icon, SparklesIcon} from '@/components/ui/icons';
import {Badge} from '@/components/glass/badge';
import {Card} from '@/components/glass/card';
import {CoverArt} from './covers';
import {AuthorBadge} from './AuthorBadge';
import {BookmarkButton} from './BookmarkButton';

export function FeaturedPostCard({post}: {post: PostSummary}) {
  const formatDate = useFormatDate();

  return (
    // Whole card is one link target: the title link stretches over the card
    // (after:absolute after:inset-0); the tag and Save button sit above it.
    <Card className="group relative gap-0 overflow-hidden py-0 lg:grid lg:grid-cols-2">
      {/* min-h only at lg: with an aspect ratio, a min-height also forces a
          min-width (240 × 16/10 = 384px), overflowing narrow phones */}
      <CoverArt
        permalink={post.permalink}
        className="aspect-[16/10] w-full md:aspect-[16/7] lg:aspect-auto lg:h-full lg:min-h-[240px]">
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <SparklesIcon size={13} /> Featured
        </span>
        <span className="absolute right-4 bottom-4 max-w-[calc(100%-2rem)] rounded-md bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {formatDate(post.date)}
        </span>
      </CoverArt>

      <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags[0] && (
            <Badge asChild className="relative z-10 rounded-full px-3 py-1 font-medium">
              <Link to={post.tags[0].permalink}>{post.tags[0].label}</Link>
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatReadingTime(post.readingTime)}
          </span>
        </div>

        <h2 className="!mb-0 !text-2xl !font-semibold tracking-tight lg:!text-3xl">
          <Link
            to={post.permalink}
            className="!text-foreground outline-none transition-colors after:absolute after:inset-0 after:rounded-surface group-hover:!text-primary focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset">
            {post.title}
          </Link>
        </h2>

        <p className="!mb-0 line-clamp-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <AuthorBadge author={post.author} />
          <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:inline-flex">
            <Clock01Icon size={15} />
            {formatReadingTime(post.readingTime)}
          </span>
          <BookmarkButton
            permalink={post.permalink}
            size={15}
            label="Save"
            className="relative z-10"
          />
        </div>
      </div>
    </Card>
  );
}
