import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';
import {translate} from '@docusaurus/Translate';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Button from '@theme/CodeBlock/Buttons/Button';
import {CheckmarkCircle01Icon, Copy01Icon} from '@/components/ui/icons';
import type {Props} from '@theme/CodeBlock/Buttons/CopyButton';

function title() {
  return translate({
    id: 'theme.CodeBlock.copy',
    message: 'Copy',
    description: 'The copy button label on code blocks',
  });
}

function ariaLabel(isCopied: boolean) {
  return isCopied
    ? translate({
        id: 'theme.CodeBlock.copied',
        message: 'Copied',
        description: 'The copied button label on code blocks',
      })
    : translate({
        id: 'theme.CodeBlock.copyButtonAriaLabel',
        message: 'Copy code to clipboard',
        description: 'The ARIA label for copy code blocks button',
      });
}

function useCopyButton() {
  const {
    metadata: {code},
  } = useCodeBlockContext();
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);

  const copyCode = useCallback(() => {
    copy(code);
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return {copyCode, isCopied};
}

export default function CopyButton({className}: Props): ReactNode {
  const {copyCode, isCopied} = useCopyButton();

  return (
    <Button
      aria-label={ariaLabel(isCopied)}
      title={title()}
      className={clsx(className, 'relative')}
      onClick={copyCode}>
      <span className="relative inline-flex size-4" aria-hidden="true">
        <Copy01Icon
          size={16}
          className={clsx(
            'absolute inset-0 transition-all duration-150',
            isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <CheckmarkCircle01Icon
          size={16}
          className={clsx(
            'absolute inset-0 text-emerald-500 transition-all duration-150',
            isCopied
              ? 'scale-100 opacity-100 delay-75'
              : 'scale-0 opacity-0',
          )}
        />
      </span>
    </Button>
  );
}
