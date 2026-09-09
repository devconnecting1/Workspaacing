"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";
import { parse } from "date-fns";
import { Check, Clock, MoreHorizontal, X } from "lucide-react";
import type { useTranslations } from "next-intl";

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { cn, getInitials } from "@/lib/utils";

import { statusMeta, type UserRow } from "./data";

type Translator = ReturnType<typeof useTranslations>;

const statusLabelKeys: Record<UserRow["status"], string> = {
  Active: "Active",
  "Pending invite": "PendingInvite",
  Deactivated: "Deactivated",
  Locked: "Locked",
  Suspended: "Suspended",
};

export const roleLabelKeys: Record<string, string> = {
  "Workspace Owner": "users.roleWorkspaceOwner",
  Admin: "users.roleAdmin",
  "Billing Admin": "users.roleBillingAdmin",
  "Security Admin": "users.roleSecurityAdmin",
  "Team Lead": "users.roleTeamLead",
  Contributor: "users.roleContributor",
  Guest: "users.roleGuest",
  "Read-only": "users.roleReadOnly",
};

export const teamLabelKeys: Record<string, string> = {
  Platform: "users.teamPlatform",
  Growth: "users.teamGrowth",
  Revenue: "users.teamRevenue",
  "Customer Ops": "users.teamCustomerOps",
  "Internal Tools": "users.teamInternalTools",
  Compliance: "users.teamCompliance",
  "People Ops": "users.teamPeopleOps",
  Finance: "users.teamFinance",
};

function RoleCell({ role, team, t }: { role: string; team: string; t: Translator }) {
  return (
    <div className="grid gap-0.5">
      <span className="whitespace-nowrap">{t(roleLabelKeys[role])}</span>
      <span className="text-muted-foreground text-xs">{t(teamLabelKeys[team])}</span>
    </div>
  );
}

function StatusBadge({ status, label }: { status: UserRow["status"]; label: string }) {
  const meta = statusMeta[status];

  return (
    <Badge className={cn("gap-1.5 border px-2 py-1 font-medium", meta.badgeClass)} variant="outline">
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {label}
    </Badge>
  );
}

function getAvatarTone(name: string) {
  const tones = [
    "[&_[data-slot=avatar-fallback]]:bg-amber-100 [&_[data-slot=avatar-fallback]]:text-amber-700 after:border-amber-200 dark:[&_[data-slot=avatar-fallback]]:bg-amber-500/15 dark:[&_[data-slot=avatar-fallback]]:text-amber-300 dark:after:border-amber-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-orange-100 [&_[data-slot=avatar-fallback]]:text-orange-700 after:border-orange-200 dark:[&_[data-slot=avatar-fallback]]:bg-orange-500/15 dark:[&_[data-slot=avatar-fallback]]:text-orange-300 dark:after:border-orange-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-rose-100 [&_[data-slot=avatar-fallback]]:text-rose-700 after:border-rose-200 dark:[&_[data-slot=avatar-fallback]]:bg-rose-500/15 dark:[&_[data-slot=avatar-fallback]]:text-rose-300 dark:after:border-rose-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-pink-100 [&_[data-slot=avatar-fallback]]:text-pink-700 after:border-pink-200 dark:[&_[data-slot=avatar-fallback]]:bg-pink-500/15 dark:[&_[data-slot=avatar-fallback]]:text-pink-300 dark:after:border-pink-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-fuchsia-100 [&_[data-slot=avatar-fallback]]:text-fuchsia-700 after:border-fuchsia-200 dark:[&_[data-slot=avatar-fallback]]:bg-fuchsia-500/15 dark:[&_[data-slot=avatar-fallback]]:text-fuchsia-300 dark:after:border-fuchsia-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-purple-100 [&_[data-slot=avatar-fallback]]:text-purple-700 after:border-purple-200 dark:[&_[data-slot=avatar-fallback]]:bg-purple-500/15 dark:[&_[data-slot=avatar-fallback]]:text-purple-300 dark:after:border-purple-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-violet-100 [&_[data-slot=avatar-fallback]]:text-violet-700 after:border-violet-200 dark:[&_[data-slot=avatar-fallback]]:bg-violet-500/15 dark:[&_[data-slot=avatar-fallback]]:text-violet-300 dark:after:border-violet-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 after:border-indigo-200 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300 dark:after:border-indigo-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-sky-100 [&_[data-slot=avatar-fallback]]:text-sky-700 after:border-sky-200 dark:[&_[data-slot=avatar-fallback]]:bg-sky-500/15 dark:[&_[data-slot=avatar-fallback]]:text-sky-300 dark:after:border-sky-500/20",
    "[&_[data-slot=avatar-fallback]]:bg-emerald-100 [&_[data-slot=avatar-fallback]]:text-emerald-700 after:border-emerald-200 dark:[&_[data-slot=avatar-fallback]]:bg-emerald-500/15 dark:[&_[data-slot=avatar-fallback]]:text-emerald-300 dark:after:border-emerald-500/20",
  ];

  return tones[name.length % tones.length];
}

function getLastActiveBadge(lastActive: number) {
  if (lastActive < 1) {
    return {
      className: "bg-green-600 text-green-950 [&>svg]:text-white",
      icon: Check,
    };
  }

  if (lastActive < 4 * 60) {
    return {
      className: "bg-amber-500 text-amber-950",
      icon: Clock,
    };
  }

  if (lastActive < 7 * 24 * 60) {
    return {
      className: "bg-destructive",
      icon: null,
    };
  }

  return {
    className: "bg-muted-foreground text-muted",
    icon: X,
  };
}

function AvatarCell({ lastActive, name }: { lastActive: number; name: string }) {
  const badge = getLastActiveBadge(lastActive);
  const BadgeIcon = badge.icon;

  return (
    <Avatar size="lg" className={cn("font-medium", getAvatarTone(name))}>
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
      <AvatarBadge className={badge.className}>{BadgeIcon ? <BadgeIcon /> : null}</AvatarBadge>
    </Avatar>
  );
}

function WorkspaceCell({ workspaces }: { workspaces: string[] }) {
  const [firstWorkspace, ...remainingWorkspaces] = workspaces;
  const remainingCount = remainingWorkspaces.length;

  return (
    <AvatarGroup className="*:data-[slot=avatar]:ring-0">
      {firstWorkspace ? (
        <Avatar className="after:rounded-sm">
          <AvatarFallback className="rounded-sm ring-0">{getInitials(firstWorkspace)}</AvatarFallback>
        </Avatar>
      ) : null}
      {remainingCount > 0 ? (
        <AvatarGroupCount className="rounded-sm border ring-card">+{remainingCount}</AvatarGroupCount>
      ) : null}
    </AvatarGroup>
  );
}

const joinedDateFormatter = (locale: string) =>
  new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

export function createUsersColumns(t: Translator, locale: string): ColumnDef<DataTableFeatures, UserRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Subscribe
            source={table.atoms.rowSelection}
            selector={() =>
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() && "indeterminate")
            }
          >
            {(checked) => (
              <Checkbox
                aria-label={t("users.selectAll")}
                checked={checked}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              />
            )}
          </Subscribe>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
            {(checked) => (
              <Checkbox
                aria-label={t("users.selectUser", { name: row.original.name })}
                checked={checked}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
              />
            )}
          </Subscribe>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: "search",
      accessorFn: (row) => `${row.name} ${row.email}`,
      filterFn: "includesString",
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: t("users.columnUser"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <AvatarCell name={row.original.name} lastActive={row.original.lastActive} />
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground text-sm">{row.original.name}</div>
            <div className="truncate text-muted-foreground text-sm">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("users.columnRoleTeam"),
      filterFn: "equalsString",
      cell: ({ row }) => <RoleCell role={row.original.role} team={row.original.team} t={t} />,
    },
    {
      accessorKey: "team",
      header: t("users.columnTeam"),
      filterFn: "equalsString",
      cell: ({ row }) => <div className="text-sm">{t(teamLabelKeys[row.original.team])}</div>,
    },
    {
      accessorKey: "workspace",
      header: t("users.columnWorkspace"),
      filterFn: "arrIncludes",
      cell: ({ row }) => <WorkspaceCell workspaces={row.original.workspace} />,
    },
    {
      accessorKey: "status",
      header: t("users.columnStatus"),
      filterFn: "equalsString",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} label={t(`users.status${statusLabelKeys[row.original.status]}`)} />
      ),
    },
    {
      id: "joinedDate",
      accessorFn: (row) => parse(row.joinedDate, "dd MMM yyyy, h:mm a", new Date()).getTime(),
      header: t("users.columnJoinedDate"),
      cell: ({ row }) => {
        const joined = parse(row.original.joinedDate, "dd MMM yyyy, h:mm a", new Date());
        return <div className="text-foreground text-sm">{joinedDateFormatter(locale).format(joined)}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("users.columnActions")}</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={t("users.openActions", { name: row.original.name })}
                className="size-8 rounded-md text-muted-foreground hover:bg-muted/50"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("users.actionViewProfile")}</DropdownMenuItem>
              <DropdownMenuItem>{t("users.actionEditUser")}</DropdownMenuItem>
              <DropdownMenuItem>{t("users.actionManageTeam")}</DropdownMenuItem>
              <DropdownMenuItem>{t("users.actionResendInvite")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">{t("users.actionDeactivateUser")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
