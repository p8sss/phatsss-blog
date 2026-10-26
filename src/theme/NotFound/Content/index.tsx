import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';

import {Badge} from '@/components/glass/badge';
import {Button} from '@/components/glass/button';
import {Card} from '@/components/glass/card';
import {Home06Icon} from '@/components/ui/icons';
import {PROSE_CLASSES} from '@/lib/prose';

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
      <Card className="max-w-md items-center gap-4 p-10 text-center">
        <Badge variant="secondary" className="font-mono text-xs tracking-widest">
          404
        </Badge>
        <Heading
          as="h1"
          className="!text-xl !font-semibold !tracking-tight text-foreground">
          <Translate
            id="theme.NotFound.title"
            description="The title of the 404 page">
            Page Not Found
          </Translate>
        </Heading>
        <div className={clsx('text-muted-foreground', PROSE_CLASSES)}>
          <p>
            <Translate
              id="theme.NotFound.p1"
              description="The first paragraph of the 404 page">
              We could not find what you were looking for.
            </Translate>
          </p>
          <p>
            <Translate
              id="theme.NotFound.p2"
              description="The 2nd paragraph of the 404 page">
              Please contact the owner of the site that linked you to the
              original URL and let them know their link is broken.
            </Translate>
          </p>
        </div>
        <Button asChild className="mt-2">
          <a href="/">
            <Home06Icon size={15} />
            <Translate
              id="theme.NotFound.backToHome"
              description="The label of the button to go back to the home page"
              values={{}}>
              {'Back to homepage'}
            </Translate>
          </a>
        </Button>
      </Card>
    </main>
  );
}
