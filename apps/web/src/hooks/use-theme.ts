"use client";

import type { ThemeMode } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

type ThemeSelection = "light" | "dark" | "system";
type Resolved = "light" | "dark";

export function useTheme() {
  const theme = usePreferencesStore((s) => s.values.theme_mode) as ThemeSelection;
  const resolvedTheme = usePreferencesStore((s) => s.resolvedThemeMode) as Resolved;
  const setPreference = usePreferencesStore((s) => s.setPreference);

  const setTheme = (value: ThemeMode) => {
    setPreference("theme_mode", value);
  };

  return { theme, resolvedTheme, setTheme };
}
