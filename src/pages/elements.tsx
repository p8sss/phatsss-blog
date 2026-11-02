import React, {type JSX} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {ComponentIcon} from '@/components/ui/icons';
import {Badge} from '@/components/glass/badge';
import {Button} from '@/components/glass/button';
import {Card} from '@/components/glass/card';

export default function Elements(): JSX.Element {
  return (
    <Layout
      title={translate({id: 'elements.title', message: 'Elements'})}
      description="UI elements playground">
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
        <Card className="mx-auto max-w-xl items-center gap-3 border-dashed border-foreground/25 px-6 py-20 text-center shadow-none">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm">
            <ComponentIcon size={26} />
          </span>
          <Badge variant="tinted" className="mt-2 rounded-full px-3 py-1">
            {translate({id: 'elements.comingSoon', message: 'Coming soon'})}
          </Badge>
          <h1 className="!mb-0 !text-2xl !font-semibold tracking-tight sm:!text-3xl">
            {translate({
              id: 'elements.title',
              message: 'Elements',
            })}
          </h1>
          <p className="!mb-0 max-w-md text-muted-foreground">
            {translate({
              id: 'elements.descriptionInProgress',
              message:
                'A curated collection of UI elements and building blocks is in the works. Meanwhile, there’s plenty to read:',
            })}
          </p>
          <nav
            aria-label={translate({
              id: 'elements.nextStepsLabel',
              message: 'Explore the site',
              description: 'ARIA label of the link group on the Elements placeholder page',
            })}
            className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link to="/blog">
                {translate({id: 'elements.cta.blog', message: 'Read the blog'})}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/docs/intro">
                {translate({id: 'elements.cta.tutorials', message: 'Tutorials'})}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/bookmarks">
                {translate({id: 'elements.cta.bookmarks', message: 'Your bookmarks'})}
              </Link>
            </Button>
          </nav>
        </Card>
      </main>
    </Layout>
  );
}
