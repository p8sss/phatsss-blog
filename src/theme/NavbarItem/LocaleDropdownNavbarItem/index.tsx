import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAlternatePageUtils } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";

import { GlassGroupItem } from "@/components/glass/glass-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/glass/dropdown-menu";
import { CheckmarkCircle01Icon, GlobeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function LocaleDropdownNavbarItem({
  mobile = false,
  dropdownItemsBefore = [],
  dropdownItemsAfter = [],
  queryString = "",
  ...props
}: {
  mobile?: boolean;
  dropdownItemsBefore?: React.ReactNode[];
  dropdownItemsAfter?: React.ReactNode[];
  queryString?: string;
} & Omit<React.ComponentProps<typeof GlassGroupItem>, "children">) {
  const {
    i18n: { currentLocale, locales, localeConfigs },
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const { search, hash } = useLocation();

  const localeItems = locales.map((locale) => {
    const baseTo = `pathname://${alternatePageUtils.createUrl({
      locale,
      fullyQualified: false,
    })}`;
    // preserve ?search#hash suffix on locale switches
    return {
      locale,
      label: localeConfigs[locale].label,
      lang: localeConfigs[locale].htmlLang,
      to: `${baseTo}${search}${hash}${queryString}`,
    };
  });

  if (mobile) {
    return (
      <div className={cn("space-y-2", props.className)}>
        {dropdownItemsBefore}
        <div className="px-1 text-xs font-medium text-muted-foreground">
          {translate({
            message: "Languages",
            id: "theme.navbar.mobileLanguageDropdown.label",
            description:
              "The label for the mobile language switcher dropdown",
          })}
        </div>
        {/* plain items: this list sits inside the glass sheet */}
        <div className="flex flex-col gap-0.5">
          {localeItems.map((item) => {
            const current = item.locale === currentLocale;
            return (
              <GlassGroupItem key={item.locale} asChild selected={current}>
                <Link
                  to={item.to}
                  hrefLang={item.lang}
                  autoAddBaseUrl={false}
                  aria-current={current ? "true" : undefined}
                  className="w-full justify-start"
                >
                  <GlobeIcon size={16} />
                  {item.label}
                  {current && <CheckmarkCircle01Icon size={14} className="ml-auto" />}
                </Link>
              </GlassGroupItem>
            );
          })}
        </div>
        {dropdownItemsAfter}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GlassGroupItem
          {...props}
          className={cn("text-muted-foreground hover:text-foreground", props.className)}
          aria-label={translate({
            message: "Languages",
            id: "theme.navbar.mobileLanguageDropdown.label",
            description:
              "The label for the mobile language switcher dropdown",
          })}
        >
          <GlobeIcon size={16} />
          {/* label only where there's room; the aria-label covers the icon-only state */}
          <span className="hidden xl:inline">{localeConfigs[currentLocale].label}</span>
        </GlassGroupItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownItemsBefore}
        {localeItems.map((item) => (
          <DropdownMenuItem
            key={item.locale}
            asChild
            lang={item.lang}
            data-active={item.locale === currentLocale || undefined}
          >
            <Link
              to={item.to}
              hrefLang={item.lang}
              autoAddBaseUrl={false}
              className="w-full cursor-pointer justify-between"
            >
              <span>{item.label}</span>
              {item.locale === currentLocale && (
                <CheckmarkCircle01Icon size={14} className="text-primary" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        {dropdownItemsAfter}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
