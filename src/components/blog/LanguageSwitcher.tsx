import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAlternatePageUtils } from "@docusaurus/theme-common/internal";
import Link from "@docusaurus/Link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckmarkCircle01Icon, GlobeIcon } from "@/components/ui/icons";

const LOCALES = ["en", "th", "lo"] as const;

export function LanguageSwitcher() {
  const {
    i18n: { currentLocale, locales, localeConfigs },
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 px-2.5 text-xs font-semibold uppercase tracking-widest"
        >
          <GlobeIcon size={14} />
          {currentLocale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => {
          // `pathname://` opts the cross-locale link out of the broken-link
          // checker (same trick the built-in locale dropdown uses).
          const url = `pathname://${alternatePageUtils.createUrl({
            locale,
            fullyQualified: false,
          })}`;
          const active = locale === currentLocale;
          return (
            <DropdownMenuItem key={locale} asChild data-active={active || undefined}>
              <Link
                to={url}
                hrefLang={localeConfigs[locale].htmlLang}
                autoAddBaseUrl={false}
                className="w-full cursor-pointer justify-between"
              >
                <span>{localeConfigs[locale].label}</span>
                {active && (
                  <CheckmarkCircle01Icon size={14} className="text-primary" />
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
