"use client";

import { CalendarDays, FileText, MessageSquare, Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, getInitials } from "@/lib/utils";

import { dueDateLabelKeys, tagTones, teamLabelKeys } from "./data";
import { TaskPriorityBadge } from "./task-priority-badge";
import type { BoardState, Column, ColumnId, Task } from "./types";

interface KanbanListViewProps {
  orderedColumns: Column[];
  tasks: BoardState;
}

export function KanbanListView({ orderedColumns, tasks }: KanbanListViewProps) {
  const t = useTranslations();

  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-color:var(--border)_transparent] lg:px-6 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {orderedColumns.map((column) => (
          <section key={column.id} className="flex flex-col gap-2" aria-labelledby={`kanban-list-${column.id}`}>
            <div className="flex items-baseline gap-2 px-1">
              <h2 id={`kanban-list-${column.id}`} className="font-medium text-sm">
                {t(column.labelKey)}
              </h2>
              <span className="text-muted-foreground text-sm tabular-nums">
                {t("kanban.tasksCount", { count: tasks[column.id].length })}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border bg-background">
              {tasks[column.id].map((task, index) => (
                <TaskListRow key={task.id} task={task} columnId={column.id} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function TaskListRow({ task, columnId, index }: { task: Task; columnId: ColumnId; index: number }) {
  const t = useTranslations();
  const isDone = columnId === "shipped";
  const showProgress = columnId === "building" && typeof task.progress === "number";
  const owner = task.owner;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6",
        index > 0 && "border-t",
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h3 className="truncate font-medium text-sm">{t(task.titleKey)}</h3>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{t(task.descriptionKey)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:shrink-0 lg:justify-end">
        <TaskPriorityBadge priority={task.priority} />

        <div className="flex items-center gap-1.5">
          <Avatar className={cn("size-5 after:rounded-sm", owner.tone)}>
            <AvatarFallback className="rounded-sm text-[10px]">{getInitials(owner.name)}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-sm">{owner.name}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="truncate text-sm">{t(dueDateLabelKeys[task.dueDate])}</span>
          <CalendarDays className="size-3" />
        </div>

        <Badge
          variant="secondary"
          className={cn("rounded-md border-transparent px-2 font-medium", tagTones[task.team])}
        >
          {t(teamLabelKeys[task.team])}
        </Badge>

        {showProgress && (
          <div className="flex items-center gap-2">
            <Progress value={task.progress} className="w-24" />
            <span className="text-muted-foreground text-xs tabular-nums">{task.progress}%</span>
          </div>
        )}
        {!showProgress && isDone && (
          <Badge className="rounded-md border-transparent bg-green-500/10 px-2 font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300">
            {t("kanban.done")}
          </Badge>
        )}
        {!showProgress && !isDone && (
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            {task.insights.map((insight) => (
              <span key={insight.label} className="flex items-center gap-1.5 text-sm">
                <InsightIcon label={insight.label} />
                {insight.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightIcon({ label }: { label: Task["insights"][number]["label"] }) {
  const icons = {
    Attachments: Paperclip,
    Comments: MessageSquare,
    Documents: FileText,
  } as const;

  const Icon = icons[label];

  return <Icon className="size-3.5" />;
}
