import React, { type JSX } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useThemeConfig } from "@docusaurus/theme-common";

import { cn } from "@/lib/utils";
import styles from "./brand.module.css";

/** static/img/phatsss-logo.png is 677×314; rendered 28px tall (h-7). */
const LOGO_HEIGHT = 28;
const LOGO_WIDTH = Math.round((677 / 314) * LOGO_HEIGHT);

interface NavbarBrandProps {
  className?: string;
  /** Animated galaxy swirl + rim light — for the glass pill in the navbar. */
  glow?: boolean;
}

/** Logo alone linking home. Explicit image size keeps it from shifting layout. */
export function NavbarBrand({ className, glow = false }: NavbarBrandProps): JSX.Element {
  const { navbar } = useThemeConfig();
  const homeHref = useBaseUrl("/");
  const logoSrc = useBaseUrl(navbar.logo?.src ?? "");
  return (
    <Link
      to={homeHref}
      autoAddBaseUrl={false}
      // the (translated) navbar title is the link's name; only the logo shows
      aria-label={navbar.title || "Home"}
      // data-slot opts into chrome.css's revert-layer fix, so Infima's link
      // colour doesn't override text-foreground
      data-slot="navbar-brand"
      className={cn(
        "glass-focus relative flex shrink-0 items-center gap-2 rounded-control font-heading text-[0.95rem] font-bold text-foreground hover:text-foreground",
        glow && styles.brand,
        className
      )}
    >
      {glow && (
        <>
          <span className={styles.aura} aria-hidden="true">
            <span className={styles.swirl} />
          </span>
          <span className={styles.rim} aria-hidden="true">
            <span className={styles.comet} />
          </span>
        </>
      )}
      {navbar.logo?.src && (
        <img src={logoSrc} alt={navbar.logo.alt ?? ""} width={LOGO_WIDTH} height={LOGO_HEIGHT} className="h-7 w-auto" />
      )}
    </Link>
  );
}
