import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/Navbar/Layout";

import { ScrollEdge } from "@/components/glass/scroll-edge";
import { MobileNavSheet } from "@/components/navbar/MobileNavSheet";

/**
 * Replaces Infima's .navbar shell: a clear sticky bar (its controls carry the
 * glass), a soft scroll-edge band that fades in once content is underneath,
 * and the glass sheet that replaces Infima's mobile sidebar.
 * Height is mirrored in --ifm-navbar-height (custom.css) for anchor offsets.
 */
export default function NavbarLayout({ children }: Props): ReactNode {
  return (
    <>
      <ScrollEdge edge="top" variant="soft" />
      <nav
        data-bar-edge="top"
        aria-label={translate({
          id: "theme.NavBar.navAriaLabel",
          message: "Main",
          description: "The ARIA label for the main navigation",
        })}
        className={clsx(
          ThemeClassNames.layout.navbar.container,
          // z-40: above page content, below glasscn overlays (sheet, menus, tooltips: z-50)
          "sticky top-0 z-40 pt-3"
        )}
      >
        {children}
      </nav>
      <MobileNavSheet />
    </>
  );
}
