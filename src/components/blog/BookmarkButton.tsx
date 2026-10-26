import {useEffect, useState} from 'react';
import {cn} from '@/lib/utils';
import {isBookmarked, toggleBookmark} from '@/lib/bookmarks';
import {Bookmark01Icon, BookmarkCheck01Icon} from '@/components/ui/icons';
import {Button} from '@/components/ui/button';

function iconClass(size?: number) {
  if (size !== undefined && size <= 12) {
    return 'size-3';
  }
  if (size !== undefined && size <= 14) {
    return 'size-3.5';
  }
  return 'size-4';
}

export function BookmarkButton({
  permalink,
  size = 16,
  className,
  label,
}: {
  permalink: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(permalink));
    setMounted(true);
  }, [permalink]);

  const handleClick = () => {
    const next = toggleBookmark(permalink);
    setSaved(next);
  };

  const icon = saved ? (
    <BookmarkCheck01Icon className={iconClass(size)} />
  ) : (
    <Bookmark01Icon className={iconClass(size)} />
  );

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground',
          className,
        )}>
        {icon}
        {label}
      </span>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
      variant="outline"
      className={cn(
        'h-auto cursor-pointer gap-1.5 px-2.5 py-1.5 text-xs font-medium',
        saved && 'text-primary',
        className,
      )}>
      {icon}
      {label}
    </Button>
  );
}
