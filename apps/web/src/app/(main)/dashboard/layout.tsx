import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { ShellSidebar } from "@/app/(main)/dashboard/_components/sidebar/shell-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { AccountSwitcher } from "./_components/header/account-switcher";
import { GitHubRepositoriesMenu } from "./_components/header/github-repositories-menu";
import { LayoutControls } from "./_components/header/layout-controls";
import { SearchDialog } from "./_components/header/search-dialog";
import { SidebarToggleButton } from "./_components/header/sidebar-toggle-button";
import { ThemeSwitcher } from "./_components/header/theme-switcher";
import { ScrollToTop } from "./_components/scroll-to-top";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant"),
    getPreference("sidebar_collapsible"),
  ]);

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="h-full min-h-0"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      <ScrollToTop />
      <ShellSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&]:mx-auto",
          "[html[data-content-layout=centered]_&]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
          "min-h-0 min-w-0 flex-1 overflow-hidden",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarToggleButton />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
              />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls />
              <ThemeSwitcher />
              <GitHubRepositoriesMenu />
              <AccountSwitcher users={users} />
            </div>
          </div>
        </header>
        {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
