import React, {useEffect, useState, type JSX} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {useBlogData} from '@/lib/blogData';
import {getBookmarks} from '@/lib/bookmarks';
import {PostCard} from '@/components/blog/PostCard';
import {Bookmark01Icon} from '@/components/ui/icons';
import {Badge} from '@/components/glass/badge';
import {Button} from '@/components/glass/button';
import {Card} from '@/components/glass/card';

export default function Bookmarks(): JSX.Element {
  const {blogPosts} = useBlogData();
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(getBookmarks());
  }, []);

  const posts = (blogPosts ?? []).filter((post) =>
    saved.includes(post.permalink),
  );

  return (
    <Layout
      title={translate({id: 'bookmarks.title', message: 'Bookmarks'})}
      description="Saved articles">
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
        <header className="mb-10">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 rounded-full bg-muted/50 px-3 py-1 font-medium text-muted-foreground">
            <Bookmark01Icon size={14} />
            {translate({id: 'bookmarks.eyebrow', message: 'Saved for later'})}
          </Badge>
          <h1 className="!mb-3 !text-3xl !font-semibold tracking-tight sm:!text-4xl">
            {translate({id: 'bookmarks.title', message: 'Bookmarks'})}
          </h1>
          <p className="!mb-0 text-lg text-muted-foreground">
            {translate({
              id: 'bookmarks.description',
              message: 'Articles you saved from the blog, stored in your browser.',
            })}
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.permalink} post={post} />
            ))}
          </div>
        ) : (
          <Card className="items-center border-dashed py-24 text-center shadow-none">
            <Bookmark01Icon size={28} className="text-muted-foreground" />
            <p className="font-medium text-foreground">
              {translate({
                id: 'bookmarks.empty',
                message: 'No bookmarks yet',
              })}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {translate({
                id: 'bookmarks.emptyHint',
                message:
                  'Tap the bookmark icon on any article to save it here for later reading.',
              })}
            </p>
            <Button asChild className="mt-2">
              <Link to="/blog">
                {translate({id: 'bookmarks.browse', message: 'Browse articles'})}
              </Link>
            </Button>
          </Card>
        )}
      </main>
    </Layout>
  );
}
