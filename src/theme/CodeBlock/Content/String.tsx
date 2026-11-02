import React, {type ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  CodeBlockContextProvider,
  type CodeBlockMetadata,
  createCodeBlockMetadata,
  useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/CodeBlock/Content/String';
import CodeBlockLayout from '@theme/CodeBlock/Layout';

/** Snippets this short (a shell command or two) read better without numbers. */
const LINE_NUMBERS_MIN_LINES = 4;

/**
 * Line numbers by default only on longer blocks. An explicit prop wins, and a
 * `showLineNumbers` metastring (optionally with a start line) is left to
 * Docusaurus by returning undefined.
 */
function defaultShowLineNumbers(props: Props): Props['showLineNumbers'] {
  if (props.showLineNumbers !== undefined) {
    return props.showLineNumbers;
  }
  if (props.metastring?.includes('showLineNumbers')) {
    return undefined;
  }
  const lineCount = props.children.replace(/\n$/, '').split('\n').length;
  return lineCount >= LINE_NUMBERS_MIN_LINES;
}

function useCodeBlockMetadata(props: Props): CodeBlockMetadata {
  const {prism} = useThemeConfig();
  return createCodeBlockMetadata({
    code: props.children,
    className: props.className,
    metastring: props.metastring,
    magicComments: prism.magicComments,
    defaultLanguage: prism.defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: defaultShowLineNumbers(props),
  });
}

// TODO Docusaurus v4: move this component at the root?
export default function CodeBlockString(props: Props): ReactNode {
  const metadata = useCodeBlockMetadata(props);
  const wordWrap = useCodeWordWrap();
  return (
    <CodeBlockContextProvider metadata={metadata} wordWrap={wordWrap}>
      <CodeBlockLayout />
    </CodeBlockContextProvider>
  );
}
