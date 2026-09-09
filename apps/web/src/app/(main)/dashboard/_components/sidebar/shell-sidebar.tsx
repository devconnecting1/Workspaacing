"use client";

import type { Sidebar } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";

export function ShellSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return <AppSidebar {...props} />;
}
