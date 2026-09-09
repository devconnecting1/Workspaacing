import { LockKeyhole } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { type ProfileRecord, profileValueLabelKeys } from "./profile-data";

export async function PersonalDetails({ profile }: { profile: ProfileRecord }) {
  const t = await getTranslations();
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-medium text-base">{t("profile.personalInformation")}</h2>
          <Badge className="rounded-sm" variant="outline">
            <LockKeyhole data-icon="inline-start" />
            {t("profile.private")}
          </Badge>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.preferredName")}</dt>
              <dd className="text-sm">{profile.preferredName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.dateOfBirth")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.dateOfBirth])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.legalName")}</dt>
              <dd className="text-sm">{profile.legalName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.personalEmail")}</dt>
              <dd className="text-sm">{profile.personalEmail}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.pronouns")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.pronouns])}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.workPhone")}</dt>
              <dd className="text-sm">{profile.workPhone}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-medium text-base">{t("profile.addressEmergencyContact")}</h2>
          <Badge className="rounded-sm" variant="outline">
            <LockKeyhole data-icon="inline-start" />
            {t("profile.private")}
          </Badge>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.homeAddress")}</dt>
              <dd className="text-sm">{profile.address}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.emergencyContact")}</dt>
              <dd className="text-sm">{t(profileValueLabelKeys[profile.emergencyContact])}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">{t("profile.emergencyPhone")}</dt>
              <dd className="text-sm">{profile.emergencyPhone}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
