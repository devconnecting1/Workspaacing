"use client";

import { PanelLeftClose } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileSidebarClose() {
  const t = useTranslations("shell");
  const { setOpenMobile } = useSidebar();

  return (
    <Button
      type="button"
      aria-label={t("closeMenu")}
      size="icon-sm"
      variant="ghost"
      className="md:hidden"
      onClick={() => setOpenMobile(false)}
    >
      <PanelLeftClose aria-hidden="true" />
    </Button>
  );
}
