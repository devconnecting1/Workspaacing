import { CalendarDays, CircleCheck, Clock3 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";

import { type ProfileRecord, profileValueLabelKeys } from "./profile-data";

export async function ProfileStatusSidebar({ profile }: { profile: ProfileRecord }) {
  const t = await getTranslations();
  return (
    <aside>
      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-medium text-sm">{t("profile.recordStatus")}</h2>
        <div className="flex items-start gap-2">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">{t("profile.activeContractor")}</p>
            <p className="text-muted-foreground text-xs">{t("profile.contractAccessActive")}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          {t("profile.updatedByLabel", { date: t(profileValueLabelKeys[profile.updatedAt]), user: profile.updatedBy })}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3">
        <h2 className="font-heading font-medium text-sm">{t("profile.upcomingEvents")}</h2>
        <div className="flex flex-col">
          <div className="flex gap-3 py-2.5">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t("profile.timeOff")}</p>
              <p className="text-muted-foreground text-xs">{t(profileValueLabelKeys[profile.nextLeave])}</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3 py-2.5">
            <Clock3 aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{t("profile.lastWorkingDay")}</p>
              <p className="text-muted-foreground text-xs">{t(profileValueLabelKeys[profile.lastWorkingDay])}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
