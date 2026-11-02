import React, { useRef, type JSX } from "react";
import { translate } from "@docusaurus/Translate";
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from "@docusaurus/theme-common/internal";
// our swizzled items, imported directly: @theme types them with the stock Props
import NavbarColorModeToggle from "@/theme/Navbar/ColorModeToggle";
import LocaleDropdownNavbarItem from "@/theme/NavbarItem/LocaleDropdownNavbarItem";

import { Button } from "@/components/glass/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/glass/sheet";
import { ArrowLeft01Icon } from "@/components/ui/icons";
import { NavbarBrand } from "./NavbarBrand";
import { NavLinks } from "./NavLinks";

/** Shared with the menu button in Navbar/Content (aria-controls + focus return). */
export const MOBILE_MENU_ID = "navbar-mobile-menu";
export const MOBILE_MENU_BUTTON_ID = "navbar-mobile-menu-button";

/**
 * The mobile menu as a glass sheet. Open state is Docusaurus's mobile-sidebar
 * context, so the docs sidebar (rendered into the secondary menu by
 * DocSidebar/Mobile) can still close it when a doc is picked.
 */
export function MobileNavSheet(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const secondaryMenu = useNavbarSecondaryMenu();
  const showSecondary = secondaryMenu.shown && Boolean(secondaryMenu.content);
  // set when a link closes the sheet: focus then follows the new page, not the menu button
  const closedByNavigation = useRef(false);

  const setOpen = (open: boolean) => {
    if (open !== mobileSidebar.shown) mobileSidebar.toggle();
  };

  return (
    <Sheet open={mobileSidebar.shown} onOpenChange={setOpen}>
      <SheetContent
        id={MOBILE_MENU_ID}
        side="left"
        // denser frost than the default sheet: page content (cover images,
        // headings) must not read through behind the menu rows
        className="[--glass-liquid-blur:28px] [--glass-liquid-opacity:88%]"
        onCloseAutoFocus={(event) => {
          // the menu button isn't a Radix SheetTrigger (it lives in the navbar,
          // the sheet here), so return focus to it explicitly — unless a link
          // closed the sheet, where Docusaurus moves focus for the new route
          event.preventDefault();
          if (closedByNavigation.current) {
            closedByNavigation.current = false;
            return;
          }
          document.getElementById(MOBILE_MENU_BUTTON_ID)?.focus();
        }}
      >
        <SheetHeader>
          <SheetTitle asChild>
            <div>
              <NavbarBrand />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {translate({ id: "navbar.mobile.description", message: "Site navigation" })}
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-6">
          {showSecondary ? (
            <>
              <Button variant="ghost" size="sm" className="self-start" onClick={secondaryMenu.hide}>
                <ArrowLeft01Icon size={16} />
                {translate({
                  id: "theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel",
                  message: "← Back to main menu",
                  description: "The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)",
                }).replace(/^←\s*/, "")}
              </Button>
              {secondaryMenu.content}
            </>
          ) : (
            <>
              <NavLinks
                orientation="vertical"
                onNavigate={() => {
                  closedByNavigation.current = true;
                  setOpen(false);
                }}
                className="w-full"
              />
              <LocaleDropdownNavbarItem mobile />
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {translate({ id: "navbar.mobile.theme", message: "Theme" })}
                </span>
                <NavbarColorModeToggle variant="ghost" />
              </div>
            </>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
