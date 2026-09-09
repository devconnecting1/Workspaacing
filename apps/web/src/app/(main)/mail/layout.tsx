import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { MailSidebar } from "./_components/mail-sidebar";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative h-full overflow-hidden">
      <SidebarProvider className="h-full min-h-0">
        <MailSidebar />
        <div className="size-full min-h-0 overflow-hidden">{children}</div>
      </SidebarProvider>
    </div>
  );
}
