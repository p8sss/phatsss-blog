import React, {type ReactNode, useState, useCallback} from 'react';
import clsx from 'clsx';
import {prefersReducedMotion} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import type {Props} from '@theme/DocRoot/Layout/Sidebar';

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({children}: {children: ReactNode}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: Props): ReactNode {
  const {pathname} = useLocation();

  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  return (
    <aside
      className={clsx(
        'hidden shrink-0 min-[997px]:block min-[997px]:w-64',
        hiddenSidebarContainer && 'min-[997px]:hidden',
      )}>
      <ResetOnSidebarChange>
        <div
          className={clsx(
            // p-10/-m-10 gives the glass card's shadow room inside the
            // scroll box, so overflow-y-auto doesn't clip it to a hard edge
            'min-[997px]:sticky min-[997px]:top-14 min-[997px]:-m-10 min-[997px]:max-h-[calc(100vh-3.5rem)] min-[997px]:overflow-y-auto min-[997px]:p-10',
            hiddenSidebar && 'min-[997px]:hidden',
          )}>
          <DocSidebar
            sidebar={sidebar}
            path={pathname}
            onCollapse={toggleSidebar}
            isHidden={hiddenSidebar}
          />
        </div>
        {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
      </ResetOnSidebarChange>
    </aside>
  );
}
