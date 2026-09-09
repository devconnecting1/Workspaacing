"use client";
import { FlexRender, type ReactTable } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { cn } from "@/lib/utils";

import type { PermissionSet } from "./permission-sets-data";

export function PermissionSetsTable({ table }: { table: ReactTable<DataTableFeatures, PermissionSet> }) {
  const t = useTranslations();
  const { pageIndex, pageSize } = table.state.pagination;
  const pageRows = table.getRowModel().rows;
  const filteredRows = table.getFilteredRowModel().rows;

  const start = filteredRows.length === 0 ? 0 : pageIndex * pageSize + 1;
  const end = filteredRows.length === 0 ? 0 : start + pageRows.length - 1;
  const colCount = table.getVisibleLeafColumns().length;

  return (
    <>
      <Table className="w-full border-collapse">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-y hover:bg-transparent [&>:not(:last-child)]:border-r">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="h-10 px-4 text-center font-medium text-foreground text-sm first:text-left"
                >
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {pageRows.length ? (
            pageRows.map((row) => (
              <TableRow key={row.id} className="h-12 hover:bg-muted/20">
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={cn(
                      "overflow-hidden border-r px-4 align-middle",
                      index === row.getVisibleCells().length - 1 && "border-r-0",
                      index === 0 ? "text-left" : "text-center",
                    )}
                  >
                    <div className="min-w-0">
                      <FlexRender cell={cell} />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colCount} className="h-24 text-center text-muted-foreground">
                {t("roles.permSetNoResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center border-border/70 border-t p-4">
        <div className="text-muted-foreground text-sm">
          {t("roles.permSetShowingResults", { start, end, total: filteredRows.length })}
        </div>

        <div className="mx-auto">
          <Pagination className="mx-0 w-auto justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="sm"
                  href="#"
                  text=""
                  aria-label={t("roles.previousPage")}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  size="sm"
                  href="#"
                  isActive
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  size="sm"
                  href="#"
                  text=""
                  aria-label={t("roles.nextPage")}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{t("roles.rowsPerPage")}</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(v) => {
              table.setPageSize(Number(v));
            }}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" side="top">
              <SelectGroup>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
