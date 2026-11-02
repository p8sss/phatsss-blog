import React, {type ReactNode, useState} from 'react';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout';

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    // 1200px + px-6: the same container as the navbar and footer
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      <BackToTopButton />
      {/* 997px = Docusaurus's mobile-sidebar breakpoint; below it the docs
          menu lives in the navbar sheet, so there's never a gap */}
      <div className="flex flex-col min-[997px]:flex-row min-[997px]:items-start min-[997px]:gap-10">
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
      </div>
    </div>
  );
}
