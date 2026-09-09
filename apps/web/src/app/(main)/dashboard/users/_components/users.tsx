"use client";
import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { Cog, Download, Grid, Plus, Rows3, Search, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTableFeatures } from "@/lib/data-table-features";

import { filters, type UserRow } from "./data";
import { createUsersColumns, roleLabelKeys, teamLabelKeys } from "./users-columns";
import { UsersGridView } from "./users-grid-view";
import { UsersTable } from "./users-table";

const STATUS_LABELS = {
  Active: "users.statusActive",
  "Pending invite": "users.statusPendingInvite",
  Deactivated: "users.statusDeactivated",
  Locked: "users.statusLocked",
  Suspended: "users.statusSuspended",
} as const;

type UsersView = "list" | "grid";

export function Users({ users }: { users: UserRow[] }) {
  const locale = useLocale();
  const t = useTranslations();
  const [view, setView] = React.useState<UsersView>("list");
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "joinedDate", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({
    search: false,
    team: false,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useTable({
    features: dataTableFeatures,
    data: users,
    columns: React.useMemo(() => createUsersColumns(t, locale), [t, locale]),
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.email,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const searchQuery = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const roleFilter = (table.getColumn("role")?.getFilterValue() as string | undefined) ?? filters.role[0];
  const teamFilter = (table.getColumn("team")?.getFilterValue() as string | undefined) ?? filters.team[0];
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? filters.status[0];
  const workspaceFilter =
    (table.getColumn("workspace")?.getFilterValue() as string | undefined) ?? filters.workspace[0];
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  function setColumnSelectFilter(columnId: string, value: string) {
    table.getColumn(columnId)?.setFilterValue(value === "All" ? undefined : value);
    table.setPageIndex(0);
  }

  function statusLabel(option: string) {
    return option === "All" ? t("users.all") : t(STATUS_LABELS[option as keyof typeof STATUS_LABELS]);
  }

  function roleLabel(option: string) {
    return option === "All" ? t("users.all") : t(roleLabelKeys[option]);
  }

  function teamLabel(option: string) {
    return option === "All" ? t("users.all") : t(teamLabelKeys[option]);
  }

  function optionLabel(option: string) {
    return option === "All" ? t("users.all") : option;
  }

  return (
    <Card>
      <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle className="text-xl leading-none">{t("users.title")}</CardTitle>
        <CardDescription className="max-w-sm leading-snug">{t("users.description")}</CardDescription>
        <CardAction className="col-start-1 row-start-auto flex w-full flex-wrap justify-start gap-2 justify-self-stretch md:col-start-2 md:row-span-2 md:row-start-1 md:w-auto md:flex-nowrap md:justify-end md:justify-self-end">
          <InputGroup className="h-7 w-full md:w-64">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              className="h-7"
              placeholder={t("users.searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => {
                table.getColumn("search")?.setFilterValue(event.target.value || undefined);
                table.setPageIndex(0);
              }}
            />
            <InputGroupAddon align="inline-end">
              <Kbd className="h-4 text-[10px]">⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline" size="sm">
            <SlidersHorizontal /> {t("users.hide")}
          </Button>
          <Button variant="outline" size="sm">
            <Cog /> {t("users.customize")}
          </Button>
          <Button variant="outline" size="sm">
            <Download /> {t("users.export")}
          </Button>
          <Button size="sm">
            <Plus /> {t("users.addUser")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={roleFilter} onValueChange={(value) => setColumnSelectFilter("role", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">{t("users.roleLabel")}</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.role.map((option) => (
                    <SelectItem key={option} value={option}>
                      {roleLabel(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={teamFilter} onValueChange={(value) => setColumnSelectFilter("team", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">{t("users.teamLabel")}</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.team.map((option) => (
                    <SelectItem key={option} value={option}>
                      {teamLabel(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setColumnSelectFilter("status", value)}>
              <SelectTrigger size="sm">
                <span className="text-muted-foreground">{t("users.statusLabel")}</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectGroup>
                  {filters.status.map((option) => (
                    <SelectItem key={option} value={option}>
                      {statusLabel(option)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Select value={workspaceFilter} onValueChange={(value) => setColumnSelectFilter("workspace", value)}>
            <SelectTrigger size="sm">
              <span className="text-muted-foreground">{t("users.workspaceLabel")}</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {filters.workspace.map((option) => (
                  <SelectItem key={option} value={option}>
                    {optionLabel(option)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 px-4">
          <div className="text-muted-foreground text-sm tabular-nums">
            {t("users.selected", { count: selectedCount })}
          </div>

          <Tabs value={view} onValueChange={(value) => setView(value as UsersView)}>
            <TabsList>
              <TabsTrigger value="list" aria-label={t("users.listView")}>
                <Rows3 />
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label={t("users.gridView")}>
                <Grid />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === "list" ? (
          <UsersTable table={table} />
        ) : (
          <UsersGridView users={table.getFilteredRowModel().rows.map((row) => row.original)} t={t} />
        )}
      </CardContent>
    </Card>
  );
}
