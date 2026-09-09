"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggleButton() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      className="-ml-1 [&_svg]:transition-transform [&_svg]:duration-300"
    >
      {isCollapsed ? <PanelRightClose /> : <PanelRightOpen />}
    </Button>
  );
}
