import React, {type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';

import {Button} from '@/components/ui/button';
import {ArrowLeft01Icon} from '@/components/ui/icons';
import type {Props} from '@theme/DocSidebar/Desktop/CollapseButton';

export default function CollapseButton({onClick}: Props): ReactNode {
  return (
    <Button
      type="button"
      variant="ghost"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      onClick={onClick}
      className="hidden h-10 w-full shrink-0 rounded-none border-t text-muted-foreground shadow-none hover:bg-accent hover:text-foreground lg:flex">
      <ArrowLeft01Icon size={16} className="rtl:-scale-x-100" />
    </Button>
  );
}
