import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Buttons from '@theme-original/CodeBlock/Buttons';
import type {Props} from '@theme/CodeBlock/Buttons';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import {useHorizontalOverflow} from '@/hooks/use-horizontal-overflow';

/**
 * A fade on the right edge while a long line runs past it — the cue that the
 * block scrolls sideways. Gone once scrolled to the end or word-wrapped.
 */
function ScrollCue(): ReactNode {
  const {wordWrap} = useCodeBlockContext();
  const {isScrollable, isAtEnd} = useHorizontalOverflow(wordWrap.codeBlockRef, [
    wordWrap.isEnabled,
  ]);
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-y-px right-px w-12 rounded-r-[inherit] bg-linear-to-l from-(--prism-background-color) to-transparent transition-opacity duration-150',
        isScrollable && !isAtEnd ? 'opacity-100' : 'opacity-0',
      )}
    />
  );
}

/**
 * Stock buttons plus the scroll cue (both sit in the block's relative content
 * box). `code-buttons` is the stable hook custom.css uses to keep the buttons
 * visible on touch screens and while the block has focus.
 */
export default function ButtonsWrapper({className, ...props}: Props): ReactNode {
  return (
    <>
      <ScrollCue />
      <Buttons {...props} className={clsx(className, 'code-buttons')} />
    </>
  );
}
