import React, {type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';

import {Button} from '@/components/ui/button';
import {ArrowRight01Icon} from '@/components/ui/icons';
import type {Props} from '@theme/DocRoot/Layout/Sidebar/ExpandButton';

export default function DocRootLayoutSidebarExpandButton({
  toggleSidebar,
}: Props): ReactNode {
  return (
    <Button
      variant="ghost"
      title={translate({
        id: 'theme.docs.sidebar.expandButtonTitle',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.expandButtonAriaLabel',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      tabIndex={0}
      onKeyDown={toggleSidebar}
      onClick={toggleSidebar}
      className="doc-sidebar-expand-button absolute inset-0 z-10 hidden h-auto w-full rounded-none text-muted-foreground hover:bg-accent lg:flex">
      <ArrowRight01Icon size={16} className="rtl:-scale-x-100" />
    </Button>
  );
}
