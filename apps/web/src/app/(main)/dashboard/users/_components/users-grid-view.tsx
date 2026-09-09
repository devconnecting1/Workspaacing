"use client";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getInitials } from "@/lib/utils";

import { statusMeta, type UserRow } from "./data";
import { roleLabelKeys, teamLabelKeys } from "./users-columns";

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

function getStatusDot(status: UserRow["status"]) {
  return statusMeta[status].dotClass;
}

function getStatusBadgeClasses(status: UserRow["status"]) {
  return statusMeta[status].badgeClass;
}

export function UsersGridView({
  users,
  t,
}: {
  users: UserRow[];
  t: ReturnType<typeof import("next-intl").useTranslations>;
}) {
  return (
    <div className="grid gap-3 px-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {users.map((user) => (
        <Card key={user.email} className="gap-3 py-3">
          <CardContent className="flex flex-col gap-3 px-3">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className={getAvatarTone(user.name)}>
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                <AvatarBadge className={getStatusDot(user.status)} />
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sm">{user.name}</div>
                <div className="truncate text-muted-foreground text-sm">{user.email}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-md border-transparent px-2 font-medium">
                {t(roleLabelKeys[user.role])}
              </Badge>
              <Badge variant="secondary" className="rounded-md border-transparent px-2 font-medium">
                {t(teamLabelKeys[user.team])}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <Badge
                className={cn("gap-1.5 border px-2 py-1 font-medium", getStatusBadgeClasses(user.status))}
                variant="outline"
              >
                <span className={cn("size-1.5 rounded-full", getStatusDot(user.status))} />
                {t(`users.status${user.status === "Pending invite" ? "PendingInvite" : user.status}`)}
              </Badge>
              {user.workspace.length > 0 ? (
                <span className="truncate text-muted-foreground text-xs">{user.workspace.join(", ")}</span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
