"use client";

import { ArrowUpRight, Flame, type LucideIcon, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { TaskPriority } from "./types";

const priorityBadgeConfig: Record<
  TaskPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string; labelKey: string }
> = {
  High: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
    labelKey: "kanban.priorityHigh",
  },
  Low: {
    icon: Minus,
    variant: "secondary",
    className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
    labelKey: "kanban.priorityLow",
  },
  Medium: {
    icon: ArrowUpRight,
    variant: "secondary",
    className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    labelKey: "kanban.priorityMedium",
  },
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const t = useTranslations();
  const config = priorityBadgeConfig[priority];
  const PriorityIcon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("shrink-0 rounded-md border-transparent px-2 font-medium", config.className)}
    >
      <PriorityIcon data-icon="inline-start" />
      {t(config.labelKey)}
    </Badge>
  );
}
