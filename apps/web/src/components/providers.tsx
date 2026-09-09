"use client";

import type { ReactNode } from "react";

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

export function Providers({ children }: { children: ReactNode }) {
  return <PreferencesStoreProvider initialValues={PREFERENCE_DEFAULTS}>{children}</PreferencesStoreProvider>;
}
