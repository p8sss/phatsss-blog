import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useToday} from '@/hooks/use-today';

/** "© 2025": a year baked into a translation file by write-translations. */
const COPYRIGHT_YEAR = /(©\s*)\d{4}/;

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
      {/* data-slot: chrome.css lets these links keep their own colours over Infima's */}
      <ul className="space-y-1">
        {section.items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-slot="footer-link"
                className="inline-flex min-h-7 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {item.label}
              </a>
            ) : (
              <Link
                to={item.to ?? '/'}
                data-slot="footer-link"
                className="inline-flex min-h-7 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
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
  const year = useToday().getFullYear();
  if (!footer) {
    return null;
  }

  const sections = (footer.links ?? []) as unknown as FooterLinkSection[];
  // config computes the year at build time, but a footer.json translation
  // would freeze it — always show the current one
  const copyright =
    'copyright' in footer
      ? footer.copyright?.replace(COPYRIGHT_YEAR, `$1${year}`)
      : undefined;

  return (
    <footer className={ThemeClassNames.layout.footer.container}>
      <div className="glass-subtle rounded-none border-x-0 border-b-0 [--glass-elevation:0_0_#0000]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
          {sections.length > 0 && (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {sections.map((section, i) => (
                <FooterColumn key={section.title ?? i} section={section} />
              ))}
            </div>
          )}
          {copyright && (
            <div className="mt-8 text-center text-xs text-muted-foreground">
              {/* the galaxy accents fading out at both ends, in place of a flat rule */}
              <div
                aria-hidden="true"
                className="mb-6 h-0.5 rounded-full bg-[linear-gradient(90deg,transparent,var(--galaxy-amber)_20%,var(--galaxy-rose)_45%,var(--galaxy-violet)_65%,var(--galaxy-teal)_82%,transparent)]"
              />
              {copyright}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
