"use client";

import { Ellipsis, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

import type { Mail } from "./data";
import { MailList } from "./mail-list";

interface MailInboxProps {
  mails: Mail[];
  onSelectMail?: (mail: Mail) => void;
}

export function MailInbox({ mails, onSelectMail }: MailInboxProps) {
  const t = useTranslations();
  const pinnedMails = mails.filter((mail) => mail.isPinned);
  const unpinnedMails = mails.filter((mail) => !mail.isPinned);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-3">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center">
          <h1 className="font-medium text-xl leading-none">{t("mail.inbox")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <SlidersHorizontal />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <RotateCcw />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </div>
      </div>

      <div className="px-2">
        <Separator />
      </div>

      <div className="px-2">
        <InputGroup className="h-7 w-full rounded-md">
          <InputGroupInput className="h-7" placeholder={t("mail.searchMail")} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <MailList
          groups={[
            {
              id: "pinned",
              title: t("mail.pinned"),
              items: pinnedMails,
            },
            {
              id: "inbox",
              title: t("mail.inbox"),
              items: unpinnedMails,
            },
          ]}
          onSelectMail={onSelectMail}
        />
      </div>
    </div>
  );
}
