"use client";

import { useRouter } from "next/navigation";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setClientCookie } from "@/lib/cookie.client";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "en", label: "English" },
] as const;

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("shell");
  const router = useRouter();

  function setLocale(code: string) {
    setClientCookie("locale", code, 365);
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("languageDialogTitle")}
          className={cn("gap-1 text-muted-foreground", className)}
        >
          <Globe className="size-4" />
          {locale.toUpperCase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{t("languageDialogTitle")}</DialogTitle>
          <DialogDescription>{t("languageDialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {LOCALES.map((option) => (
            <Button
              key={option.code}
              type="button"
              variant={locale === option.code ? "secondary" : "ghost"}
              className="justify-between px-2.5"
              onClick={() => setLocale(option.code)}
            >
              {option.label}
              {locale === option.code && <Check className="size-4" />}
            </Button>
          ))}
        </div>
        <p className="flex items-start gap-1.5 rounded-lg bg-muted/50 px-2.5 py-2 text-muted-foreground text-xs">
          <span aria-hidden>⚠</span>
          {t("languageDialogWarning")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
