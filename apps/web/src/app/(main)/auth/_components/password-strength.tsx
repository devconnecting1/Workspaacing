"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type StrengthLevel = "weak" | "fair" | "good" | "strong";

interface StrengthRule {
  label: string;
  met: boolean;
}

function getStrengthLevel(score: number): StrengthLevel {
  if (score <= 1) return "weak";
  if (score <= 2) return "fair";
  if (score <= 3) return "good";
  return "strong";
}

const levelColors: Record<StrengthLevel, string> = {
  weak: "bg-destructive",
  fair: "bg-amber-500",
  good: "bg-blue-500",
  strong: "bg-emerald-500",
};

const levelTrackColors: Record<StrengthLevel, string> = {
  weak: "bg-destructive/15",
  fair: "bg-amber-500/15",
  good: "bg-blue-500/15",
  strong: "bg-emerald-500/15",
};

export function PasswordStrength({ password }: { password: string }) {
  const t = useTranslations("auth.form");

  const rules: StrengthRule[] = useMemo(
    () => [
      { label: t("strengthMinChars"), met: password.length >= 8 },
      { label: t("strengthUppercase"), met: /[A-Z]/.test(password) },
      { label: t("strengthLowercase"), met: /[a-z]/.test(password) },
      { label: t("strengthNumber"), met: /[0-9]/.test(password) },
      { label: t("strengthSpecial"), met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password, t],
  );

  const score = rules.filter((r) => r.met).length;
  const level = getStrengthLevel(score);
  const _percentage = (score / rules.length) * 100;

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {rules.map((rule, i) => (
          <div
            key={rule.label}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < score ? levelColors[level] : levelTrackColors[level],
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-medium text-xs",
            level === "weak" && "text-destructive",
            level === "fair" && "text-amber-600 dark:text-amber-400",
            level === "good" && "text-blue-600 dark:text-blue-400",
            level === "strong" && "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {t(`strengthLevel${level.charAt(0).toUpperCase() + level.slice(1)}`)}
        </span>
        <span className="text-muted-foreground text-xs">
          {score}/{rules.length}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {rules.map((rule) => (
          <div key={rule.label} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
                rule.met ? "border-emerald-500 bg-emerald-500/10" : "border-muted-foreground/30 bg-muted/50",
              )}
            >
              {rule.met && (
                <svg
                  className="size-2 text-emerald-600 dark:text-emerald-400"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={cn("text-xs", rule.met ? "text-foreground" : "text-muted-foreground")}>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
