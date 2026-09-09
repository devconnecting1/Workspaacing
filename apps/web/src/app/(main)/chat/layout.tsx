import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { ChatHeader } from "./_components/chat-header";
import { ChatSidebar } from "./_components/chat-sidebar";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-full min-h-0 overflow-hidden [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex h-full min-h-0 flex-col">
        <ChatHeader />
        <div className="flex min-h-0 flex-1">
          <ChatSidebar />
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
