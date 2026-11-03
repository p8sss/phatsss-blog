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
        // mt-12 matches Main's py-12 so the card lines up with the article
        // instead of butting against the navbar logo; self-stretch overrides
        // the row's items-start so the aside spans the article and the
        // sticky child below has room to stick
        'hidden shrink-0 min-[997px]:mt-12 min-[997px]:block min-[997px]:w-64 min-[997px]:self-stretch',
        hiddenSidebarContainer && 'min-[997px]:hidden',
      )}>
      <ResetOnSidebarChange>
        <div
          className={clsx(
            // p-10/-m-10 gives the glass card's shadow room inside the
            // scroll box, so overflow-y-auto doesn't clip it to a hard edge.
            // Sticky top = navbar height + (mt-12 - p-10), so the card holds
            // its resting position on scroll rather than sliding under the logo
            'min-[997px]:sticky min-[997px]:top-[calc(var(--ifm-navbar-height)+0.5rem)] min-[997px]:-m-10 min-[997px]:max-h-[calc(100vh-var(--ifm-navbar-height)-0.5rem)] min-[997px]:overflow-y-auto min-[997px]:p-10',
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
