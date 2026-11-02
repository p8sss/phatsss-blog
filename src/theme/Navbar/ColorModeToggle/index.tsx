import React from "react";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";

import { Button } from "@/components/glass/button";
import { Moon02Icon, Sun03Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ColorModeToggleProps {
  className?: string;
  buttonClassName?: string;
  /** "glass" floats over content (navbar); "ghost" sits on a glass surface (mobile sheet). */
  variant?: "glass" | "ghost";
}

/**
 * One icon button that flips light ⇄ dark. The icons are stacked in a single
 * grid cell and swapped by the `dark:` variant (html[data-theme]), so the
 * right one shows before hydration without reading React state.
 */
export default function ColorModeToggle({
  className,
  buttonClassName,
  variant = "glass",
}: ColorModeToggleProps): React.JSX.Element {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const label = isDark
    ? translate({
        id: "theme.colorToggle.switchToLight",
        message: "Switch to light mode",
        description: "The aria label of the color mode button while dark mode is on",
      })
    : translate({
        id: "theme.colorToggle.switchToDark",
        message: "Switch to dark mode",
        description: "The aria label of the color mode button while light mode is on",
      });

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setColorMode(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn("grid place-items-center [&>svg]:col-start-1 [&>svg]:row-start-1", className, buttonClassName)}
    >
      <Sun03Icon
        size={18}
        className="transition-[rotate,scale,opacity] duration-(--glass-duration) dark:-rotate-90 dark:scale-0 dark:opacity-0"
      />
      <Moon02Icon
        size={18}
        className="rotate-90 scale-0 opacity-0 transition-[rotate,scale,opacity] duration-(--glass-duration) dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </Button>
  );
}
