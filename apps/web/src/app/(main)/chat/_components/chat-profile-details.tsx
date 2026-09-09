"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  Link,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Tag,
  UserRound,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";

import { formatChatFullDate } from "./chat-time";
import type { Contact } from "./data";

interface ChatProfileDetailsProps {
  contact: Contact;
  onClose?: () => void;
}

export function ChatProfileDetails({ contact, onClose }: ChatProfileDetailsProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback className="bg-background">{getInitials(contact.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium leading-5">{contact.name}</div>
          <div className="truncate text-muted-foreground text-xs">{t(contact.roleKey)}</div>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label={t("chat.closeProfile")} onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button size="icon-sm" variant="ghost" aria-label={t("chat.email")}>
          <Mail className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("chat.call")}>
          <PhoneCall className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("chat.schedule")}>
          <Calendar className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("chat.copyLink")}>
          <Link className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("chat.more")}>
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList variant="line" className="w-full justify-between border-b px-0 **:data-[slot=tabs-trigger]:flex-1">
          <TabsTrigger value="details">{t("chat.details")}</TabsTrigger>
          <TabsTrigger value="files">{t("chat.files")}</TabsTrigger>
          <TabsTrigger value="activity">{t("chat.activity")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.email")}</span>
            <span className="ml-auto truncate text-sm">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.phone")}</span>
            <span className="ml-auto truncate text-sm">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.website")}</span>
            <span className="ml-auto truncate text-sm">{contact.website}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.company")}</span>
            <span className="ml-auto truncate text-sm">{contact.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.role")}</span>
            <span className="ml-auto truncate text-sm">{t(contact.roleKey)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.stage")}</span>
            <Badge variant="secondary" className="ml-auto">
              {t(contact.statusKey)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.qualifiedSince")}</span>
            <span className="ml-auto truncate text-sm">{formatChatFullDate(contact.qualifiedAt, locale)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.timezone")}</span>
            <span className="ml-auto truncate text-sm">{contact.timezone}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.location")}</span>
            <span className="ml-auto truncate text-sm">{contact.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{t("chat.tags")}</span>
            <div className="ml-auto flex flex-wrap justify-end gap-1">
              {contact.tagKeys.map((tagKey) => (
                <Badge key={tagKey} variant="outline">
                  {t(tagKey)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
