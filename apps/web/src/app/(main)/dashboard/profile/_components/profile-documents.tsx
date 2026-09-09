import { Download, FileText, LockKeyhole } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type ProfileDocument, profileValueLabelKeys } from "./profile-data";

export async function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading font-medium text-base">{t("profile.documentsTitle")}</h2>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          {t("profile.addDocument")}
        </Button>
      </div>

      <Table className="border-y">
        <TableCaption className="sr-only">{t("profile.documentsAria")}</TableCaption>
        <TableHeader className="[&_th]:h-8">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-2/5">
              <span className="sr-only">{t("profile.documentColumn")}</span>
            </TableHead>
            <TableHead>{t("profile.categoryColumn")}</TableHead>
            <TableHead>{t("profile.updatedColumn")}</TableHead>
            <TableHead>{t("profile.statusColumn")}</TableHead>
            <TableHead className="text-right">{t("profile.accessColumn")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{t(profileValueLabelKeys[document.name])}</TableCell>
              <TableCell className="text-muted-foreground">{t(profileValueLabelKeys[document.category])}</TableCell>
              <TableCell className="text-muted-foreground">{t(profileValueLabelKeys[document.updatedAt])}</TableCell>
              <TableCell>
                <Badge className="rounded-sm" variant="outline">
                  {t(profileValueLabelKeys[document.status])}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {document.isRestricted ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-muted-foreground text-xs"
                    title={t("profile.restricted")}
                  >
                    <LockKeyhole aria-hidden="true" className="size-3.5" />
                    {t("profile.restricted")}
                  </span>
                ) : (
                  <Button
                    aria-label={t("profile.downloadDocument", { name: t(profileValueLabelKeys[document.name]) })}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Download />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
