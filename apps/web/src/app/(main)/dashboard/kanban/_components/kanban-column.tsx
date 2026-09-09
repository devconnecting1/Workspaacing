"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, MoreVertical, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SortableTaskCard } from "./sortable-task-card";
import type { Column, Task } from "./types";

interface KanbanColumnProps {
  column: Column;
  index: number;
  tasks: Task[];
}

export function KanbanColumn({ column, index, tasks }: KanbanColumnProps) {
  const t = useTranslations();
  const columnSortable = useSortable({
    id: `column:${column.id}`,
    index,
    type: "column",
    accept: "column",
    group: "columns",
    data: { type: "column", columnId: column.id },
  });
  const taskDropTarget = useDroppable({
    id: column.id,
    type: "task-container",
    accept: "task",
    collisionPriority: CollisionPriority.Low,
    data: { type: "task-container", columnId: column.id },
  });

  return (
    <section
      ref={columnSortable.ref}
      className={cn(
        "flex min-h-0 flex-col rounded-t-xl border bg-muted/50 transition-colors",
        (columnSortable.isDropTarget || taskDropTarget.isDropTarget) && "bg-muted/70",
        columnSortable.isDragging && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-0.5">
            <Button
              ref={columnSortable.handleRef}
              variant="ghost"
              size="icon-xs"
              className="-ml-2 cursor-grab text-foreground/70 active:cursor-grabbing"
              aria-label={t("kanban.dragColumn", { title: t(column.labelKey) })}
            >
              <GripVertical />
            </Button>
            <h2 className="truncate font-medium text-base leading-none">{t(column.labelKey)}</h2>
          </div>
          <p className="text-muted-foreground text-sm tabular-nums leading-none">
            {t("kanban.tasksCount", { count: tasks.length })}
          </p>
        </div>
        <div className="-mr-2 flex items-center gap-0.5 text-muted-foreground">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("kanban.addTaskToColumn", { title: t(column.labelKey) })}
          >
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={t("kanban.columnActions", { title: t(column.labelKey) })}>
            <MoreVertical />
          </Button>
        </div>
      </div>

      <div
        ref={taskDropTarget.ref}
        className="scrollbar-thin flex min-h-0 flex-1 touch-pan-y flex-col gap-3 overflow-y-auto px-3 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
      >
        {tasks.map((task, taskIndex) => (
          <SortableTaskCard key={task.id} task={task} columnId={column.id} index={taskIndex} />
        ))}
      </div>
    </section>
  );
}
