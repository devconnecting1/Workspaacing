"use client";

import { ChevronDown, Filter, MessageSquarePlus, Pin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getInitials } from "@/lib/utils";

import { formatChatTime } from "./chat-time";
import { useChat } from "./use-chat";

interface ChatConversationListProps {
  onSelectConversation?: (id: number) => void;
  className?: string;
}

const groupLabelKeys: Record<string, string> = {
  Pinned: "chat.groupPinned",
  Today: "chat.groupToday",
  Yesterday: "chat.groupYesterday",
};

export function ChatConversationList({ onSelectConversation, className }: ChatConversationListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { conversations, selected, selectConversation, createConversation } = useChat();

  const conversationGroups = conversations.reduce<Array<{ group: string; conversations: typeof conversations }>>(
    (groups, conversation) => {
      const group = groups.find((item) => item.group === conversation.group);
      if (group) {
        group.conversations.push(conversation);
      } else {
        groups.push({ group: conversation.group, conversations: [conversation] });
      }
      return groups;
    },
    [],
  );

  return (
    <div className={cn("flex h-full flex-col gap-3 pt-3", className)}>
      <div className="flex items-center justify-between gap-4 px-2 py-0.5">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-xl leading-none">{t("chat.inbox")}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label={t("chat.newConversation")} onClick={createConversation}>
            <MessageSquarePlus />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Filter />
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="all">
        <TabsList variant="line" className="w-full border-b px-0 **:data-[slot=tabs-trigger]:border-x-0">
          <TabsTrigger value="all">
            {t("chat.tabAll")}
            <span className="text-muted-foreground text-xs">({conversations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="open">
            {t("chat.tabOpen")}
            <span className="text-muted-foreground text-xs">({conversations.filter((c) => c.isUnread).length})</span>
          </TabsTrigger>
          <TabsTrigger value="snoozed">
            {t("chat.tabSnoozed")}
            <span className="text-muted-foreground text-xs">(0)</span>
          </TabsTrigger>
          <TabsTrigger value="closed">{t("chat.tabClosed")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea
          type="hover"
          className="**:data-[slot=scroll-area-viewport]:scroll-fade h-full min-h-0 flex-1 overflow-hidden [&_[data-orientation=vertical][data-slot=scroll-area-scrollbar]]:w-1.5"
        >
          <div className="flex flex-col gap-3 pt-0">
            {conversationGroups.map(({ group, conversations: groupConversations }) => (
              <Collapsible key={group} defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between gap-1 px-3 py-2 font-medium text-muted-foreground text-xs hover:text-foreground [&[data-state=open]>svg]:rotate-180">
                  {t(groupLabelKeys[group] ?? group)}
                  <ChevronDown className="size-3 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-1 px-2">
                    {groupConversations.map((conversation) => {
                      const isSelected = selected === conversation.id;

                      return (
                        <button
                          type="button"
                          key={conversation.id}
                          className={cn(
                            "w-full overflow-hidden rounded-lg px-2.5 py-2.5 text-left ring-inset transition-colors",
                            isSelected ? "bg-muted ring-1 ring-border" : "hover:bg-muted/75",
                          )}
                          onClick={(event) => {
                            event.currentTarget.blur();
                            selectConversation(conversation.id);
                            onSelectConversation?.(conversation.id);
                          }}
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <Avatar className="shrink-0 **:data-[slot=avatar-badge]:size-2.5">
                              <AvatarFallback
                                className={cn(
                                  "text-foreground text-xs transition-colors duration-400",
                                  isSelected && "bg-background/50",
                                )}
                              >
                                {getInitials(conversation.name)}
                              </AvatarFallback>
                              {conversation.isOnline && <AvatarBadge className="bg-green-600 dark:bg-green-800" />}
                            </Avatar>

                            <div className="w-0 flex-1 overflow-hidden">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div className="truncate font-medium text-sm leading-5">{conversation.name}</div>
                                <span className="text-nowrap text-muted-foreground text-xs leading-5">
                                  {formatChatTime(conversation.time, locale, t)}
                                </span>
                              </div>
                              <div className="flex min-w-0 items-end gap-2">
                                <div className="w-0 flex-1 overflow-hidden">
                                  <div className="truncate font-medium text-foreground/90 text-xs leading-4">
                                    {t(conversation.subjectKey)}
                                  </div>
                                  <div className="truncate text-muted-foreground text-xs leading-4">
                                    {conversation.preview ? t(conversation.previewKey) : ""}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {conversation.group === "Pinned" && (
                                    <div className="grid size-5 place-items-center">
                                      <Pin className="size-3 fill-current opacity-70" />
                                    </div>
                                  )}

                                  {conversation.isUnread && (
                                    <div className="grid size-5 place-items-center rounded-full bg-primary/90 text-primary-foreground text-xs">
                                      {conversation.unreadCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
