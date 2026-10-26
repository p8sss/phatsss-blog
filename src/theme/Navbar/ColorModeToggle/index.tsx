import React from "react";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";

import { Button } from "@/components/glass/button";
import { Moon02Icon, Sun03Icon } from "@/components/ui/icons";

const modes = ["system", "light", "dark"] as const;
type Mode = (typeof modes)[number];

function toMode(choice: string | null | undefined): Mode {
  return choice === "light" || choice === "dark" ? choice : "system";
}

export default function ColorModeToggle({
  className,
  buttonClassName,
  respectPrefersColorScheme = true,
}: {
  className?: string;
  buttonClassName?: string;
  respectPrefersColorScheme?: boolean;
}): React.JSX.Element {
  const { colorModeChoice, setColorMode } = useColorMode();

  const ariaLabels: Record<Mode, string> = {
    system: translate(
      {
        id: "theme.colorToggle.ariaLabel.system",
        message: "Switch between dark and light mode (currently system mode)",
        description:
          "The aria label of the color mode toggle when in system mode",
      },
      { respectPrefersColorScheme }
    ),
    light: translate(
      {
        id: "theme.colorToggle.ariaLabel.light",
        message: "Switch between dark and light mode (currently light mode)",
        description: "The aria label of the color mode toggle when in light mode",
      },
      { respectPrefersColorScheme }
    ),
    dark: translate(
      {
        id: "theme.colorToggle.ariaLabel.dark",
        message: "Switch between dark and light mode (currently dark mode)",
        description: "The aria label of the color mode toggle when in dark mode",
      },
      { respectPrefersColorScheme }
    ),
  };

  const handleClick = () => {
    const current = toMode(colorModeChoice);
    const next: Mode = !respectPrefersColorScheme
      ? current === "dark"
        ? "light"
        : "dark"
      : modes[(modes.indexOf(current) + 1) % modes.length];
    // Docusaurus represents the "system" choice as null.
    setColorMode(next === "system" ? null : next);
  };

  const label = ariaLabels[toMode(colorModeChoice)];

  return (
    <div className={`group ${className ?? ""}`} data-theme-choice={colorModeChoice}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className={buttonClassName}
      >
        <Sun03Icon
          size={18}
          className="size-[18px] transition-all duration-150 group-data-[theme-choice=dark]:-rotate-90 group-data-[theme-choice=dark]:scale-0 group-data-[theme-choice=dark]:opacity-0 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:-rotate-90 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:scale-0 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:opacity-0"
        />
        <Moon02Icon
          size={18}
          className="size-[18px] rotate-90 scale-0 opacity-0 transition-all duration-150 group-data-[theme-choice=dark]:rotate-0 group-data-[theme-choice=dark]:scale-100 group-data-[theme-choice=dark]:opacity-100 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:rotate-0 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:scale-100 group-data-[theme-choice=system]:[@media(prefers-color-scheme:dark)]:opacity-100"
        />
      </Button>
    </div>
  );
}
