"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, getInitials } from "@/lib/utils";

import { columns as columnDefinitions, dueDateLabelKeys, tagTones, teamLabelKeys } from "./data";
import { TaskPriorityBadge } from "./task-priority-badge";
import type { BoardState, Column, ColumnId, Task } from "./types";

interface KanbanTableViewProps {
  orderedColumns: Column[];
  tasks: BoardState;
}

export function KanbanTableView({ orderedColumns, tasks }: KanbanTableViewProps) {
  const t = useTranslations();

  const rows = orderedColumns.flatMap((column) => tasks[column.id].map((task) => ({ task, columnId: column.id })));

  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-color:var(--border)_transparent] lg:px-6 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
      <Table className="min-w-[52rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-0">{t("kanban.tableTask")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("kanban.tableColumn")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("kanban.tablePriority")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("kanban.owner")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("kanban.dueDate")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("kanban.team")}</TableHead>
            <TableHead className="hidden xl:table-cell">{t("kanban.progress")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ task, columnId }) => (
            <TableRow key={`${columnId}-${task.id}`}>
              <TableCell className="max-w-sm pl-0">
                <div className="flex min-w-0 items-center gap-3">
                  <TaskPriorityBadge priority={task.priority} />
                  <div className="min-w-0 space-y-1">
                    <span className="block truncate font-medium">{t(task.titleKey)}</span>
                    <span className="block truncate text-muted-foreground text-xs">{t(task.descriptionKey)}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary" className="rounded-md border-transparent font-medium">
                  {t(columnLabelKey(columnId))}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar className={cn("size-5 after:rounded-sm", task.owner.tone)}>
                    <AvatarFallback className="rounded-sm text-[10px]">{getInitials(task.owner.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.owner.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="text-sm">{t(dueDateLabelKeys[task.dueDate])}</span>
                  <CalendarDays className="size-3" />
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge
                  variant="secondary"
                  className={cn("rounded-md border-transparent font-medium", tagTones[task.team])}
                >
                  {t(teamLabelKeys[task.team])}
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <TaskProgress task={task} columnId={columnId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function columnLabelKey(columnId: ColumnId) {
  return columnDefinitions.find((column) => column.id === columnId)?.labelKey ?? "";
}

function TaskProgress({ task, columnId }: { task: Task; columnId: ColumnId }) {
  const t = useTranslations();

  if (columnId === "shipped") {
    return (
      <Badge className="rounded-md border-transparent bg-green-500/10 px-2 font-medium text-green-700 dark:bg-green-500/15 dark:text-green-300">
        {t("kanban.done")}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Progress value={task.progress} className="w-24" />
      <span className="text-muted-foreground text-xs tabular-nums">{task.progress}%</span>
    </div>
  );
}
