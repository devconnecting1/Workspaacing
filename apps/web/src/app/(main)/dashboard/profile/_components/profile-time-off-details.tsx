import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";

import { type ProfileRecord, profileValueLabelKeys } from "./profile-data";

export async function TimeOffDetails({ profile }: { profile: ProfileRecord }) {
  const t = await getTranslations();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.leaveBalance")}</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.policy")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.leavePolicy])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.carriedOver")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.carriedOverLeave])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.annualAllowance")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.annualLeaveAllowance])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.usedThisYear")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.usedLeave])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.remaining")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.remainingLeave])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.scheduled")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.scheduledLeave])}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.upcomingApprovals")}</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.nextLeave")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.nextLeave])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.pendingRequests")}</dt>
              <dd className="text-sm">{profile.pendingLeaveRequests}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.leaveYear")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.leaveYear])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.approver")}</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
