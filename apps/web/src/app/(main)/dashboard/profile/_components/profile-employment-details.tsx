import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";

import { type ProfileRecord, profileValueLabelKeys } from "./profile-data";

export async function EmploymentDetails({ profile }: { profile: ProfileRecord }) {
  const t = await getTranslations();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.roleOrganization")}</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.jobTitle")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.jobTitle])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.team")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.team])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.jobLevel")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.jobLevel])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.manager")}</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.department")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.department])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.currentProject")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.currentProject])}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.contractDetails")}</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.contractorId")}</dt>
              <dd className="text-sm">{profile.contractorId}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.engagementStatus")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.engagementStatus])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.employmentType")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.employmentType])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.contractingEntity")}</dt>
              <dd className="text-sm">{profile.contractingEntity}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.startDate")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.startDate])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.lastWorkingDay")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.lastWorkingDay])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.noticePeriod")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.noticePeriod])}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.workArrangement")}</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.workplace")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.workplace])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.timeZone")}</dt>
              <dd className="text-sm">{profile.timeZone}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.weeklyHours")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.weeklyHours])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.schedule")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.schedule])}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
