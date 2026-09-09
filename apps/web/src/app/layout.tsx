import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_CONFIG } from "@/config/app-config";
import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { ThemeBootScript } from "@/scripts/theme-boot";

import enMessages from "../../messages/en.json";
import ptBRMessages from "../../messages/pt-BR.json";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const store = await cookies();
  const locale = store.get("locale")?.value === "en" ? "en" : "pt-BR";
  const messages = locale === "en" ? enMessages : { ...enMessages, ...ptBRMessages };
  const { theme_mode, theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible, font } =
    PREFERENCE_DEFAULTS;
  return (
    <html
      lang={locale}
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      className="h-dvh overflow-hidden"
      suppressHydrationWarning
    >
      <head>
        {/* Applies theme and layout preferences on load to avoid flicker and unnecessary server rerenders. */}
        <ThemeBootScript />
      </head>
      <body className={`${fontVars} h-dvh min-h-0 overflow-hidden antialiased`}>
        <Providers>
          <TooltipProvider>
            <NextIntlClientProvider timeZone="America/Sao_Paulo" messages={messages}>
              {children}
            </NextIntlClientProvider>
            <Toaster />
          </TooltipProvider>
        </Providers>
        <Script async crossOrigin="anonymous" src="https://tweakcn.com/live-preview.min.js" />
        {/* Used for this project's hosted demo. Feel free to remove it; it is not required for template functionality. */}
        <Analytics />
      </body>
    </html>
  );
}
