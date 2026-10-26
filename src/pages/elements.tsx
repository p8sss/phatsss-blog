import React, {type JSX} from 'react';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import {ComponentIcon} from '@/components/ui/icons';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';

export default function Elements(): JSX.Element {
  return (
    <Layout
      title={translate({id: 'elements.title', message: 'Elements'})}
      description="UI elements playground">
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
        <Card className="mx-auto max-w-xl items-center border-dashed px-6 py-24 text-center shadow-none">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm">
            <ComponentIcon size={26} />
          </span>
          <h1 className="!mb-0 !text-2xl !font-semibold tracking-tight sm:!text-3xl">
            {translate({
              id: 'elements.title',
              message: 'Elements',
            })}
          </h1>
          <p className="!mb-0 text-muted-foreground">
            {translate({
              id: 'elements.description',
              message:
                'A curated collection of UI elements and building blocks is coming soon.',
            })}
          </p>
          <Badge
            variant="outline"
            className="mt-2 rounded-full bg-muted/50 px-3 py-1 font-medium text-muted-foreground">
            {translate({id: 'elements.comingSoon', message: 'Coming soon'})}
          </Badge>
        </Card>
      </main>
    </Layout>
  );
}
