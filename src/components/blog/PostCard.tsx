import Link from '@docusaurus/Link';
import type {PostSummary} from '@/lib/blogData';
import {formatReadingTime, useFormatDate} from '@/lib/format';
import {Clock01Icon} from '@/components/ui/icons';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {CoverArt} from './covers';
import {BookmarkButton} from './BookmarkButton';

export function PostCard({post}: {post: PostSummary}) {
  const formatDate = useFormatDate();

  return (
    <Card asChild>
      <article className="group relative h-full gap-0 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
        <Link to={post.permalink} className="block">
          <CoverArt permalink={post.permalink} className="aspect-[16/9]">
            <span className="absolute top-3 left-3 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {formatDate(post.date)}
            </span>
          </CoverArt>
        </Link>

        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <h3 className="!mb-0 !text-base !font-semibold leading-snug tracking-tight">
            <Link
              to={post.permalink}
              className="!text-foreground transition-colors group-hover:!text-primary">
              {post.title}
            </Link>
          </h3>
          <p className="!mb-0 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
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
              {formatReadingTime(post.readingTime)}
            </span>
          </div>
        </div>

        <BookmarkButton
          permalink={post.permalink}
          size={14}
          className="absolute top-2.5 right-2.5 border-0 bg-black/25 px-2 py-1 text-white backdrop-blur-sm hover:bg-black/25 hover:text-white"
          label={undefined}
        />
      </article>
    </Card>
  );
}
