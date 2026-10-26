import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import {Card} from '@/components/glass/card';
import type {Props} from '@theme/DocSidebar/Desktop';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  return (
    <Card
      className={clsx('gap-0 p-3', isHidden && 'hidden')}>
      {hideOnScroll && <Logo tabIndex={-1} />}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </Card>
  );
}

export default React.memo(DocSidebarDesktop);
