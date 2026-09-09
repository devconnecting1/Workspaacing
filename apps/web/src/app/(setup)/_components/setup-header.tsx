"use client";

import Link from "next/link";

import { Command } from "lucide-react";

import { ThemeTogglerButton } from "@/components/theme-toggler-button";
import { APP_CONFIG } from "@/config/app-config";

export function SetupHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <Link href="/auth/v2/login" className="flex items-center gap-2 font-medium">
        <Command className="size-5 text-primary" />
        <span className="text-sm">{APP_CONFIG.name}</span>
      </Link>
      <ThemeTogglerButton modes={["light", "dark"]} />
    </header>
  );
}
