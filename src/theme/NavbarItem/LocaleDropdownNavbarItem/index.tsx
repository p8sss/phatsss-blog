import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAlternatePageUtils } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";

import { Button } from "@/components/glass/button";
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
} & Omit<React.ComponentProps<typeof Button>, "children">) {
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
        <div className="text-xs font-medium text-muted-foreground">
          {translate({
            message: "Languages",
            id: "theme.navbar.mobileLanguageDropdown.label",
            description:
              "The label for the mobile language switcher dropdown",
          })}
        </div>
        {localeItems.map((item) => (
          <Link
            key={item.locale}
            to={item.to}
            hrefLang={item.lang}
            autoAddBaseUrl={false}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              item.locale === currentLocale &&
                "bg-primary/10 font-medium text-primary"
            )}
          >
            <GlobeIcon size={16} />
            {item.label}
            {item.locale === currentLocale && (
              <CheckmarkCircle01Icon size={14} className="ml-auto" />
            )}
          </Link>
        ))}
        {dropdownItemsAfter}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          {...props}
          className={cn(
            "gap-1.5 px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground",
            props.className
          )}
          aria-label={translate({
            message: "Languages",
            id: "theme.navbar.mobileLanguageDropdown.label",
            description:
              "The label for the mobile language switcher dropdown",
          })}
        >
          <GlobeIcon size={15} />
          {localeConfigs[currentLocale].label}
        </Button>
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
