export const THEME_PRESETS = ["normal", "supabase", "vercel"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];
