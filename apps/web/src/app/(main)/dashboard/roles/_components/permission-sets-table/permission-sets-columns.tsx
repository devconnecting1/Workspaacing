"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";

import type { PermissionSet } from "./permission-sets-data";

type Translator = ReturnType<typeof useTranslations>;

const typeLabelKeys: Record<string, string> = {
  System: "roles.system",
  Custom: "roles.custom",
};

const statusLabelKeys: Record<string, string> = {
  Active: "roles.active",
  "Needs review": "roles.needsReview",
};

const permSetNameKeys: Record<string, string> = {
  Users: "roles.permSetNameUsers",
  Settings: "roles.permSetNameSettings",
  Billing: "roles.permSetNameBilling",
  Reports: "roles.permSetNameReports",
  Integrations: "roles.permSetNameIntegrations",
  "Audit Logs": "roles.permSetNameAuditLogs",
  Tickets: "roles.permSetNameTickets",
  Analytics: "roles.permSetNameAnalytics",
  Exports: "roles.permSetNameExports",
  Projects: "roles.permSetNameProjects",
  Tasks: "roles.permSetNameTasks",
  "API Keys": "roles.permSetNameApiKeys",
  Repos: "roles.permSetNameRepos",
  Deployments: "roles.permSetNameDeployments",
  Webhooks: "roles.permSetNameWebhooks",
  Logs: "roles.permSetNameLogs",
  Invoices: "roles.permSetNameInvoices",
  Payments: "roles.permSetNamePayments",
  Campaigns: "roles.permSetNameCampaigns",
  Dashboards: "roles.permSetNameDashboards",
  "Knowledge Base": "roles.permSetNameKnowledgeBase",
};

const permSetDescKeys: Record<string, string> = {
  Users: "roles.permSetDescUsers",
  Settings: "roles.permSetDescSettings",
  Billing: "roles.permSetDescBilling",
  Reports: "roles.permSetDescReports",
  Integrations: "roles.permSetDescIntegrations",
  "Audit Logs": "roles.permSetDescAuditLogs",
  Tickets: "roles.permSetDescTickets",
  Analytics: "roles.permSetDescAnalytics",
  Exports: "roles.permSetDescExports",
  Projects: "roles.permSetDescProjects",
  Tasks: "roles.permSetDescTasks",
  "API Keys": "roles.permSetDescApiKeys",
  Repos: "roles.permSetDescRepos",
  Deployments: "roles.permSetDescDeployments",
  Webhooks: "roles.permSetDescWebhooks",
  Logs: "roles.permSetDescLogs",
  Invoices: "roles.permSetDescInvoices",
  Payments: "roles.permSetDescPayments",
  Campaigns: "roles.permSetDescCampaigns",
  Dashboards: "roles.permSetDescDashboards",
  "Knowledge Base": "roles.permSetDescKnowledgeBase",
};

const roleLabelKeys: Record<string, string> = {
  Owner: "roles.roleOwner",
  Admin: "roles.roleAdmin",
  Manager: "roles.roleManager",
  Support: "roles.roleSupport",
  Analyst: "roles.roleAnalyst",
  Guest: "roles.roleGuest",
  Service: "roles.roleService",
  Billing: "roles.roleBilling",
  Marketing: "roles.roleMarketing",
  Developer: "roles.roleDeveloper",
  "Project Lead": "roles.roleProjectLead",
  "Finance Viewer": "roles.roleFinanceViewer",
};

function parseLastModifiedDate(value: string) {
  return new Date(`${value} 12:00:00`);
}

export function createPermissionSetsColumns(
  t: Translator,
  locale: string,
): ColumnDef<DataTableFeatures, PermissionSet>[] {
  const lastModifiedFormatter = new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  return [
    {
      id: "search",
      accessorFn: (row) => [row.name, row.description, ...row.roles].join(" "),
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      id: "name",
      accessorKey: "name",
      header: t("roles.permSetName"),
      size: 160,
      minSize: 140,
      cell: ({ row }) => (
        <span className="font-medium text-sm">
          {permSetNameKeys[row.original.name] ? t(permSetNameKeys[row.original.name]) : row.original.name}
        </span>
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      header: t("roles.permSetDescription"),
      size: 280,
      minSize: 200,
      cell: ({ row }) => (
        <span className="truncate text-muted-foreground text-sm">
          {permSetDescKeys[row.original.name] ? t(permSetDescKeys[row.original.name]) : row.original.description}
        </span>
      ),
    },
    {
      id: "type",
      accessorKey: "type",
      header: t("roles.permSetType"),
      size: 100,
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge className="rounded-sm" variant="outline">
          {t(typeLabelKeys[row.original.type])}
        </Badge>
      ),
    },
    {
      id: "permissions",
      accessorKey: "permissions",
      header: t("roles.permSetPermissions"),
      size: 110,
      cell: ({ row }) => <span className="text-muted-foreground text-sm tabular-nums">{row.original.permissions}</span>,
    },
    {
      id: "roles",
      accessorFn: (row) => row.roles.join(" "),
      header: t("roles.permSetRoles"),
      size: 280,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center justify-start gap-2">
          {row.original.roles.slice(0, 3).map((role) => (
            <Badge className="rounded-sm" variant="outline" key={role}>
              {roleLabelKeys[role] ? t(roleLabelKeys[role]) : role}
            </Badge>
          ))}
          {row.original.roles.length > 3 ? (
            <span className="text-sm tabular-nums">+{row.original.roles.length - 3}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "lastModified",
      accessorKey: "lastModified",
      header: t("roles.permSetLastModified"),
      size: 130,
      cell: ({ row }) => (
        <span className="text-sm">
          {lastModifiedFormatter.format(parseLastModifiedDate(row.original.lastModified))}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("roles.permSetStatus"),
      size: 130,
      filterFn: "equalsString",
      cell: ({ row }) => (
        <Badge className="rounded-sm" variant="outline">
          {t(statusLabelKeys[row.original.status])}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 70,
      cell: ({ row }) => {
        const isSystem = row.original.type === "System";
        const needsReview = row.original.status === "Needs review";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuGroup>
                {needsReview ? <DropdownMenuItem>{t("roles.permSetActionReview")}</DropdownMenuItem> : null}
                <DropdownMenuItem>{t("roles.permSetActionViewDetails")}</DropdownMenuItem>
                <DropdownMenuItem disabled={isSystem}>{t("roles.permSetActionEdit")}</DropdownMenuItem>
                <DropdownMenuItem disabled={isSystem}>{t("roles.permSetActionDuplicate")}</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={isSystem} variant="destructive">
                  {t("roles.permSetActionArchive")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableColumnFilter: false,
    },
  ];
}
