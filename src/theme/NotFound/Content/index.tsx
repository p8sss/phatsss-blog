import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';

import {Button} from '@/components/glass/button';
import {Card} from '@/components/glass/card';
import {Home06Icon} from '@/components/ui/icons';

export default function NotFoundContent({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <main
      className={clsx(
        'mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-6 py-16',
        className,
      )}>
      <Card className="w-full max-w-lg items-center gap-0 px-6 py-12 text-center sm:px-10">
        {/* the display element; the h1 below names it for screen readers */}
        <p
          aria-hidden="true"
          className="!mb-0 bg-linear-to-br from-foreground to-primary bg-clip-text font-mono text-7xl leading-none font-semibold tracking-tighter text-transparent sm:text-8xl">
          404
        </p>
        <Heading
          as="h1"
          className="!mt-5 !mb-0 !text-2xl !font-semibold !tracking-tight text-foreground">
          <Translate
            id="theme.NotFound.title"
            description="The title of the 404 page">
            Page Not Found
          </Translate>
        </Heading>
        <p className="!mt-3 !mb-0 max-w-sm text-sm leading-relaxed text-muted-foreground">
          <Translate
            id="notFound.description"
            description="The paragraph under the 404 page title">
            This page wandered off into the galaxy — it may have moved, or the
            link has a typo. Try one of these instead:
          </Translate>
        </p>
        <nav
          aria-label={translate({
            id: 'notFound.linksLabel',
            message: 'Places to go from here',
            description: 'ARIA label of the link group on the 404 page',
          })}
          className="mt-8 flex flex-col items-center gap-3">
          <Button asChild>
            <Link to="/">
              <Home06Icon size={15} />
              <Translate
                id="theme.NotFound.backToHome"
                description="The label of the button to go back to the home page">
                Back to homepage
              </Translate>
            </Link>
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link to="/blog">
                <Translate
                  id="notFound.blog"
                  description="404 page link to the blog">
                  Read the blog
                </Translate>
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/docs/intro">
                <Translate
                  id="notFound.tutorial"
                  description="404 page link to the tutorials">
                  Tutorials
                </Translate>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/search">
                <Translate
                  id="notFound.search"
                  description="404 page link to the search page">
                  Search the site
                </Translate>
              </Link>
            </Button>
          </div>
        </nav>
      </Card>
    </main>
  );
}
