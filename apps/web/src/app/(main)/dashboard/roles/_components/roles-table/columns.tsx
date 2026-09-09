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

import type { Role } from "./data";

type Translator = ReturnType<typeof useTranslations>;

const accessLevelLabelKeys: Record<string, string> = {
  Full: "roles.accessFull",
  Scoped: "roles.accessScoped",
  "Read only": "roles.accessReadOnly",
  "API access": "roles.accessApi",
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

const ownerLabelKeys: Record<string, string> = {
  System: "roles.system",
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

function parseLastReviewDate(value: string) {
  return new Date(`${value} 12:00:00`);
}

export function createRolesColumns(t: Translator, locale: string): ColumnDef<DataTableFeatures, Role>[] {
  const lastReviewFormatter = new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  return [
    {
      id: "group",
      accessorKey: "group",
      filterFn: "equalsString",
      enableHiding: true,
    },
    {
      id: "search",
      accessorFn: (row) => [row.role, row.owner, ...row.permissionSets].join(" "),
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      id: "role",
      accessorKey: "role",
      header: t("roles.columnRole"),
      size: 180,
      minSize: 180,
      cell: ({ row }) => <span className="font-medium text-sm">{t(roleLabelKeys[row.original.role])}</span>,
    },
    {
      id: "accessLevel",
      accessorKey: "accessLevel",
      header: t("roles.columnAccessLevel"),
      size: 120,
      cell: ({ row }) => (
        <Badge className="rounded-sm" variant="outline">
          {t(accessLevelLabelKeys[row.original.accessLevel])}
        </Badge>
      ),
    },
    {
      id: "users",
      accessorKey: "users",
      header: t("roles.columnUsers"),
      size: 70,
      cell: ({ row }) => <span className="text-sm">{row.original.users}</span>,
    },
    {
      id: "permissionSets",
      accessorFn: (row) => row.permissionSets.join(" "),
      header: t("roles.columnPermissionSets"),
      size: 310,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center justify-start gap-2">
          {row.original.permissionSets.slice(0, 3).map((set) => (
            <Badge className="rounded-sm" variant="outline" key={set}>
              {permSetNameKeys[set] ? t(permSetNameKeys[set]) : set}
            </Badge>
          ))}
          {row.original.permissionSets.length > 3 ? (
            <span className="text-sm tabular-nums">+{row.original.permissionSets.length - 3}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "lastReview",
      accessorKey: "lastReview",
      header: t("roles.columnLastReview"),
      size: 120,
      cell: ({ row }) => (
        <span className="text-sm">{lastReviewFormatter.format(parseLastReviewDate(row.original.lastReview))}</span>
      ),
    },
    {
      id: "owner",
      accessorKey: "owner",
      header: t("roles.columnOwner"),
      size: 110,
      filterFn: "equalsString",
      cell: ({ row }) => (
        <span className="text-sm">
          {ownerLabelKeys[row.original.owner] ? t(ownerLabelKeys[row.original.owner]) : row.original.owner}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("roles.columnStatus"),
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
        const isSystemRole = row.original.group === "System roles";
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
                {needsReview ? <DropdownMenuItem>{t("roles.actionReviewChanges")}</DropdownMenuItem> : null}
                <DropdownMenuItem>{t("roles.actionViewDetails")}</DropdownMenuItem>
                <DropdownMenuItem disabled={isSystemRole}>{t("roles.actionEditRole")}</DropdownMenuItem>
                <DropdownMenuItem disabled={isSystemRole}>{t("roles.actionDuplicateRole")}</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>{t("roles.actionReviewPermissions")}</DropdownMenuItem>
                <DropdownMenuItem>{t("roles.actionManageMembers")}</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled={isSystemRole} variant="destructive">
                  {t("roles.actionArchiveRole")}
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
