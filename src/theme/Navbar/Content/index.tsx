import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
// our swizzled items, imported directly: @theme types them with the stock Props
import NavbarColorModeToggle from "@/theme/Navbar/ColorModeToggle";
import LocaleDropdownNavbarItem from "@/theme/NavbarItem/LocaleDropdownNavbarItem";
import SearchBar from "@theme/SearchBar";

import { Button } from "@/components/glass/button";
import { GlassGroup } from "@/components/glass/glass-group";
import { Menu01Icon } from "@/components/ui/icons";
import { NavbarBrand } from "@/components/navbar/NavbarBrand";
import { NavLinks } from "@/components/navbar/NavLinks";
import { MOBILE_MENU_BUTTON_ID, MOBILE_MENU_ID } from "@/components/navbar/MobileNavSheet";

/* Docusaurus switches to its mobile sidebar below 997px; the bar follows the
 * same breakpoint (min-[997px]) so the docs menu is never missing at
 * in-between widths. Class names stay literal so Tailwind can detect them. */

function MobileMenuButton(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  if (mobileSidebar.disabled) return null;
  return (
    <Button
      variant="glass"
      size="icon-lg"
      className="min-[997px]:hidden"
      id={MOBILE_MENU_BUTTON_ID}
      onClick={mobileSidebar.toggle}
      aria-haspopup="dialog"
      aria-controls={MOBILE_MENU_ID}
      aria-expanded={mobileSidebar.shown}
      aria-label={translate({
        id: "theme.docs.sidebar.toggleSidebarButtonAriaLabel",
        message: "Toggle navigation bar",
        description: "The ARIA label for hamburger menu button of mobile navigation",
      })}
    >
      <Menu01Icon size={18} />
    </Button>
  );
}

/**
 * Search and language share one liquid-glass capsule; the theme button stands alone.
 * Desktop only: on mobile the bar is just the logo and the menu, and the sheet
 * carries search, language and theme.
 */
function NavbarActions(): ReactNode {
  return (
    <div className="hidden items-center gap-2 min-[997px]:flex">
      <GlassGroup className="navbar-actions">
        <SearchBar />
        <LocaleDropdownNavbarItem className="hidden min-[997px]:inline-flex" />
      </GlassGroup>
      {/* icon-lg / h-control-lg: as tall as the capsules beside them */}
      <NavbarColorModeToggle className="size-control-lg" />
    </div>
  );
}

/**
 * glasscn navbar: the bar itself is clear — its controls are glass (Apple's
 * rule: glass can't sample glass), and a scroll-edge band behind them keeps
 * them legible over content. Three columns keep the page links centred.
 */
export default function NavbarContent(): ReactNode {
  return (
    <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-6">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          "flex min-w-0 flex-1 items-center gap-2"
        )}
      >
        {/* glass like the other two groups, so it stays legible over content */}
        <NavbarBrand glow className="glass-liquid h-control-lg rounded-button px-4" />
      </div>
      <NavLinks className="hidden min-[997px]:inline-flex" />
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          "flex flex-1 items-center justify-end"
        )}
      >
        <NavbarActions />
        <MobileMenuButton />
      </div>
    </div>
  );
}
