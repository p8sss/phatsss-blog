import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/DocRoot/Layout/Main';

export default function DocRootLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const enhanced = hiddenSidebarContainer || !sidebar;
  return (
    <main className={clsx('min-w-0 flex-1', enhanced && 'min-[997px]:mx-auto min-[997px]:max-w-4xl')}>
      <div className="py-8 min-[997px]:py-12">{children}</div>
    </main>
  );
}
