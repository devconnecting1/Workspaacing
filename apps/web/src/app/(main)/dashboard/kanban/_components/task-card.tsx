"use client";

import { BadgeCheck, CalendarDays, FileText, type LucideIcon, MessageSquare, Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

import { dueDateLabelKeys, tagTones, teamLabelKeys } from "./data";
import { TaskPriorityBadge } from "./task-priority-badge";
import type { ColumnId, Task, TaskInsightLabel } from "./types";

const taskInsightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
}: {
  task: Task;
  columnId?: ColumnId;
  isOverlay?: boolean;
}) {
  const t = useTranslations();
  const isDone = columnId === "shipped";
  const showBuildingDetails = columnId === "building" && typeof task.progress === "number";
  const owner = task.owner;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs",
        isOverlay && "w-68 rotate-1 shadow-lg",
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate font-medium text-sm leading-none">{t(task.titleKey)}</h3>
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{t(task.descriptionKey)}</p>
      </div>

      {!showBuildingDetails ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar className={cn("size-5 after:rounded-sm", owner.tone)}>
              <AvatarFallback className="rounded-sm text-[10px]">{getInitials(owner.name)}</AvatarFallback>
            </Avatar>

            <span className="text-muted-foreground text-sm">{owner.name}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
            <span className="truncate text-sm">{t(dueDateLabelKeys[task.dueDate])}</span>
            <CalendarDays className="size-3" />
          </div>
        </div>
      ) : null}

      {showBuildingDetails ? (
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="leading-none">{t("kanban.progress")}</span>
              <span className="tabular-nums leading-none">{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">{t("kanban.owner")}</span>
              <div className="flex items-center gap-1.5">
                <span className="truncate text-muted-foreground text-sm">{owner.name}</span>
                <Avatar className={cn("size-5 after:rounded-sm", owner.tone)}>
                  <AvatarFallback className="rounded-sm text-[10px]">{getInitials(owner.name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">{t("kanban.dueDate")}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="truncate text-sm">{t(dueDateLabelKeys[task.dueDate])}</span>
                <CalendarDays className="size-3" />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">{t("kanban.team")}</span>
              <Badge
                variant="secondary"
                className={cn("rounded-md border-transparent px-2 font-medium", tagTones[task.team])}
              >
                {t(teamLabelKeys[task.team])}
              </Badge>
            </div>
          </div>
        </div>
      ) : null}

      <Separator />

      <div>
        {isDone ? (
          <div className="flex items-center gap-1 font-medium text-green-700 text-sm dark:text-green-600">
            <BadgeCheck className="size-4" />
            {t("kanban.done")}
          </div>
        ) : null}

        {!isDone ? (
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            {task.insights.map((insight) => {
              const Icon = taskInsightIcons[insight.label];

              return (
                <span key={insight.label} className="flex items-center gap-1.5 text-sm">
                  <Icon className="size-3.5" />
                  {insight.count}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
