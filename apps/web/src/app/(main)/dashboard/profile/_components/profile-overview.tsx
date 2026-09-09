import { Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { type ProfileRecord, profileValueLabelKeys } from "./profile-data";

interface ProfileOverviewProps {
  profile: ProfileRecord;
}

export async function ProfileOverview({ profile }: ProfileOverviewProps) {
  const t = await getTranslations();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.about")}</h2>
        <p className="text-muted-foreground text-sm">{t(profileValueLabelKeys[profile.bio])}</p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">{t("profile.workDetails")}</h2>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.contractorId")}</span>
              <span className="text-sm">{profile.contractorId}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.engagementStatus")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.engagementStatus])}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.jobLevel")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.jobLevel])}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.department")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.department])}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.team")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.team])}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.currentProject")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.currentProject])}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.startDate")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.startDate])}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{t("profile.engagementLength")}</span>
              <span className="text-sm">{t(profileValueLabelKeys[profile.engagementLength])}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading font-medium text-base leading-none">{t("profile.reportingLine")}</h2>
            <p className="text-muted-foreground text-sm">{t("profile.directManager")}</p>
          </div>
          <Button size="sm" variant="outline">
            <Users data-icon="inline-start" />
            {t("profile.orgChart")}
          </Button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <Avatar size="lg">
            <AvatarFallback>{profile.manager.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{profile.manager.name}</p>
            <p className="text-muted-foreground text-xs">{t(profileValueLabelKeys[profile.manager.role])}</p>
          </div>
        </div>
      </div>
    </>
  );
}
