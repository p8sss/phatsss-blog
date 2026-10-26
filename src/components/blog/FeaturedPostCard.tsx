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
    <Card className="group gap-0 overflow-hidden py-0 lg:grid lg:grid-cols-2">
      <Link to={post.permalink} className="block">
        <CoverArt
          permalink={post.permalink}
          className="aspect-[16/10] h-full min-h-[240px] lg:aspect-auto">
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <SparklesIcon size={13} /> Featured
          </span>
          <span className="absolute right-4 bottom-4 rounded-md bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {formatDate(post.date)}
          </span>
        </CoverArt>
      </Link>

      <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags[0] && (
            <Badge asChild className="rounded-full px-3 py-1 font-medium">
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
            className="!text-foreground transition-colors group-hover:!text-primary">
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
          <BookmarkButton permalink={post.permalink} size={15} label="Save" />
        </div>
      </div>
    </Card>
  );
}
