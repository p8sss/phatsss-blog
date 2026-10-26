import {Avatar, AvatarFallback, AvatarImage} from '@/components/glass/avatar';
import type {PostAuthor} from '@/lib/blogData';

export function AuthorBadge({author}: {author?: PostAuthor}) {
  if (!author) {
    return null;
  }
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8">
        {author.imageURL ? (
          <AvatarImage src={author.imageURL} alt={author.name ?? ''} />
        ) : null}
        <AvatarFallback>{(author.name?.[0] ?? 'P').toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-foreground">{author.name}</span>
        {author.title && (
          <span className="text-xs text-muted-foreground">{author.title}</span>
        )}
      </div>
    </div>
  );
}
