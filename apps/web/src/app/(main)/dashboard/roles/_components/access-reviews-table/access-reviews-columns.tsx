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

import type { AccessReview } from "./access-reviews-data";

type Translator = ReturnType<typeof useTranslations>;

const statusLabelKeys: Record<string, string> = {
  Pending: "roles.reviewStatusPending",
  "In progress": "roles.reviewStatusInProgress",
  Completed: "roles.reviewStatusCompleted",
  Overdue: "roles.reviewStatusOverdue",
  Cancelled: "roles.reviewStatusCancelled",
};

const resultLabelKeys: Record<string, string> = {
  Approved: "roles.reviewResultApproved",
  "Changes required": "roles.reviewResultChangesRequired",
};

const reviewTitleKeys: Record<string, string> = {
  "Q2 Owner access review": "roles.reviewTitleQ2Owner",
  "Admin role access audit": "roles.reviewTitleAdminAudit",
  "Manager permissions validation": "roles.reviewTitleManagerValidation",
  "Service account API access": "roles.reviewTitleServiceApi",
  "Billing permissions review": "roles.reviewTitleBillingReview",
  "Developer repo access audit": "roles.reviewTitleDeveloperAudit",
  "Guest read-only access review": "roles.reviewTitleGuestReview",
  "Marketing campaign permissions": "roles.reviewTitleMarketingPermissions",
  "Support ticket access review": "roles.reviewTitleSupportReview",
  "Analyst dashboard permissions": "roles.reviewTitleAnalystPermissions",
  "Project Lead access scope": "roles.reviewTitleProjectLeadScope",
  "Integrations and webhook access": "roles.reviewTitleIntegrationsAccess",
};

const scopeLabelKeys: Record<string, string> = {
  "Quarterly review": "roles.reviewScopeQuarterly",
  "Annual review": "roles.reviewScopeAnnual",
  "Semi-annual review": "roles.reviewScopeSemiAnnual",
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

function parseDate(value: string) {
  return new Date(`${value} 12:00:00`);
}

function reviewStatusVariant(status: string) {
  if (status === "Completed") {
    return "default";
  }
  if (status === "Overdue") {
    return "destructive";
  }
  if (status === "Cancelled") {
    return "secondary";
  }
  return "outline";
}

export function createAccessReviewColumns(t: Translator, locale: string): ColumnDef<DataTableFeatures, AccessReview>[] {
  const dateFormatter = new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  return [
    {
      id: "search",
      accessorFn: (row) => [row.title, row.scope, row.reviewer, ...row.roles].join(" "),
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      id: "title",
      accessorKey: "title",
      header: t("roles.reviewColumnTitle"),
      size: 220,
      minSize: 180,
      cell: ({ row }) => (
        <span className="font-medium text-sm">
          {reviewTitleKeys[row.original.title] ? t(reviewTitleKeys[row.original.title]) : row.original.title}
        </span>
      ),
    },
    {
      id: "scope",
      accessorKey: "scope",
      header: t("roles.reviewColumnScope"),
      size: 150,
      cell: ({ row }) => (
        <Badge className="rounded-sm" variant="outline">
          {scopeLabelKeys[row.original.scope] ? t(scopeLabelKeys[row.original.scope]) : row.original.scope}
        </Badge>
      ),
    },
    {
      id: "reviewer",
      accessorKey: "reviewer",
      header: t("roles.reviewColumnReviewer"),
      size: 120,
    },
    {
      id: "roles",
      accessorFn: (row) => row.roles.join(" "),
      header: t("roles.reviewColumnRoles"),
      size: 220,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center justify-start gap-2">
          {row.original.roles.map((role) => (
            <Badge className="rounded-sm" variant="outline" key={role}>
              {roleLabelKeys[role] ? t(roleLabelKeys[role]) : role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("roles.reviewColumnStatus"),
      size: 120,
      filterFn: "equalsString",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className="rounded-sm" variant={reviewStatusVariant(status)}>
            {t(statusLabelKeys[status])}
          </Badge>
        );
      },
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: t("roles.reviewColumnDueDate"),
      size: 120,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{dateFormatter.format(parseDate(row.original.dueDate))}</span>
      ),
    },
    {
      id: "completedDate",
      accessorKey: "completedDate",
      header: t("roles.reviewColumnCompletedDate"),
      size: 140,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {row.original.completedDate ? dateFormatter.format(parseDate(row.original.completedDate)) : "\u2014"}
        </span>
      ),
    },
    {
      id: "result",
      accessorKey: "result",
      header: t("roles.reviewColumnResult"),
      size: 140,
      cell: ({ row }) => {
        const result = row.original.result;
        if (!result) {
          return <span className="text-muted-foreground text-sm">{"\u2014"}</span>;
        }
        return (
          <Badge className="rounded-sm" variant={result === "Approved" ? "default" : "destructive"}>
            {t(resultLabelKeys[result])}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 70,
      cell: ({ row }) => {
        const isCompleted = row.original.status === "Completed";
        const isCancelled = row.original.status === "Cancelled";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>{t("roles.reviewActionViewDetails")}</DropdownMenuItem>
                {!isCompleted && !isCancelled && (
                  <DropdownMenuItem>{t("roles.reviewActionStartReview")}</DropdownMenuItem>
                )}
                {isCompleted && <DropdownMenuItem>{t("roles.reviewActionReopen")}</DropdownMenuItem>}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {!isCompleted && !isCancelled && (
                  <DropdownMenuItem>{t("roles.reviewActionAssignReviewer")}</DropdownMenuItem>
                )}
                {!isCancelled && (
                  <DropdownMenuItem variant="destructive">{t("roles.reviewActionCancel")}</DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableColumnFilter: false,
    },
  ];
}
