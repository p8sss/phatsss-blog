import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import {ThemeClassNames} from '@docusaurus/theme-common';

type FooterLinkItem = {label: string; to?: string; href?: string};
type FooterLinkSection = {title?: string; items: FooterLinkItem[]};

function FooterColumn({section}: {section: FooterLinkSection}): ReactNode {
  return (
    <div className="space-y-3">
      {section.title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {section.title}
        </p>
      )}
      <ul className="space-y-2">
        {section.items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {item.label}
              </a>
            ) : (
              <Link
                to={item.to ?? '/'}
                className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer(): ReactNode {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }

  const sections = (footer.links ?? []) as unknown as FooterLinkSection[];
  const copyright = 'copyright' in footer ? footer.copyright : undefined;

  return (
    <footer className={ThemeClassNames.layout.footer.container}>
      <div className="border-t bg-muted/40">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
          {sections.length > 0 && (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {sections.map((section, i) => (
                <FooterColumn key={section.title ?? i} section={section} />
              ))}
            </div>
          )}
          {copyright && (
            <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
              {copyright}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
