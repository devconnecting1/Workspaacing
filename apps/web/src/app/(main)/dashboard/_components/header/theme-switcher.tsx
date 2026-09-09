"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const THEME_CYCLE = ["light", "dark", "system"] as const;

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const effective = theme as (typeof THEME_CYCLE)[number];

  const getIcon = () => {
    if (effective === "system") return <Monitor />;
    return resolvedTheme === "dark" ? <Moon /> : <Sun />;
  };

  return (
    <Button
      size="icon"
      aria-label="Theme"
      onClick={() => {
        const currentIndex = THEME_CYCLE.indexOf(effective);
        setTheme(THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length]);
      }}
    >
      {getIcon()}
    </Button>
  );
}
