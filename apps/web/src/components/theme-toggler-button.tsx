"use client";

import type * as React from "react";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type ThemeTogglerButtonProps = React.ComponentProps<"button"> & {
  modes?: Array<"light" | "dark" | "system">;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
};

function ThemeTogglerButton({
  modes = ["light", "dark", "system"],
  variant = "ghost",
  size = "sm",
  className,
  onClick,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const effective = theme as (typeof modes)[number];

  const getIcon = () => {
    const t = modes.includes("system") ? effective : resolvedTheme;
    if (t === "system") return <Monitor />;
    if (t === "dark") return <Moon />;
    return <Sun />;
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e);
        const i = modes.indexOf(effective);
        setTheme(modes[(i + 1) % modes.length]);
      }}
      {...props}
    >
      {getIcon()}
    </Button>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
