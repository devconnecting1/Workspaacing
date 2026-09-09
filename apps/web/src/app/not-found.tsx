"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("shell");

  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground">{t("notFoundDescription")}</p>
      <Link prefetch={false} replace href="/dashboard/chat">
        <Button variant="outline">{t("goBackHome")}</Button>
      </Link>
    </div>
  );
}
