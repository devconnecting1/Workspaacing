"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
  AlarmClock,
  ArrowLeft,
  Check,
  Copy,
  Flag,
  Globe,
  MoreHorizontal,
  Paperclip,
  PhoneCall,
  Send,
  Settings,
  Sparkles,
  Tag,
  Type,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

import { formatChatFullDate, formatChatTime } from "./chat-time";
import { type Contact, currentUser } from "./data";
import { useChat } from "./use-chat";

type ProviderModel = {
  id: string;
  name: string;
  provider: string;
};

type GroupedModels = {
  provider: string;
  providerId: string;
  models: ProviderModel[];
};

interface ChatThreadProps {
  contact?: Contact;
  messages: Array<{
    id: number;
    align: "start" | "end";
    text: string;
    textKey: string;
    time: string;
    reaction?: string;
  }>;
  onOpenContact?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function ChatThread({ contact, messages, onOpenContact, onBack, showBackButton, className }: ChatThreadProps) {
  const t = useTranslations();
  const locale = useLocale();
  const chat = useChat();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [availableModels, setAvailableModels] = useState<ProviderModel[]>([]);
  const [modelSearch, setModelSearch] = useState("");
  const [labsData, setLabsData] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void chat.loadConnectedProviders();
  }, [chat.loadConnectedProviders]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const { configStorage } = await import("@/lib/storage");
        const config = await configStorage.read();
        const providerIds = Object.keys(config.providers);
        const enabledModelIds = config.enabledModels;

        if (providerIds.length === 0) {
          setAvailableModels([]);
          return;
        }

        const [modelsRes, labsRes] = await Promise.all([
          fetch(`/api/models?provider=${providerIds.join(",")}`),
          fetch("/api/labs"),
        ]);
        if (!modelsRes.ok) return;
        const data = await modelsRes.json();
        const labs: Record<string, string> = labsRes.ok ? await labsRes.json() : {};
        setLabsData(labs);

        const models: ProviderModel[] = [];
        const entries = Object.entries(data) as Array<
          [string, { name?: string; models?: Record<string, { name?: string }> }]
        >;

        for (const [provId, provData] of entries) {
          const provName = provData.name ?? provId;
          if (provData.models) {
            for (const [modelId, modelData] of Object.entries(provData.models)) {
              const fullId = `${provId}/${modelId}`;
              if (enabledModelIds.length > 0 && !enabledModelIds.includes(modelId)) continue;
              models.push({
                id: fullId,
                name: modelData.name ?? modelId,
                provider: provName,
              });
            }
          }
        }
        setAvailableModels(models);
      } catch {
        /* ignore */
      }
    };
    void loadModels();
  }, []);

  const groupedModels: GroupedModels[] = [];
  const buildGroups = (models: ProviderModel[]) => {
    const providerMap = new Map<string, ProviderModel[]>();
    for (const m of models) {
      const existing = providerMap.get(m.provider) ?? [];
      existing.push(m);
      providerMap.set(m.provider, existing);
    }
    const groups: GroupedModels[] = [];
    for (const [provider, provModels] of providerMap) {
      groups.push({ provider, providerId: provModels[0]?.id.split("/")[0] ?? "", models: provModels });
    }
    groups.sort((a, b) => {
      const aPopular = labsData[a.providerId] ? 0 : 1;
      const bPopular = labsData[b.providerId] ? 0 : 1;
      if (aPopular !== bPopular) return aPopular - bPopular;
      return a.provider.localeCompare(b.provider);
    });
    return groups;
  };

  if (modelSearch.trim()) {
    const search = modelSearch.toLowerCase();
    const filtered = availableModels.filter(
      (m) => m.name.toLowerCase().includes(search) || m.provider.toLowerCase().includes(search),
    );
    groupedModels.push(...buildGroups(filtered));
  } else {
    groupedModels.push(...buildGroups(availableModels));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || chat.isLoading) return;
    const msg = inputValue;
    setInputValue("");
    await chat.sendMessage(msg);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    if (fileList) {
      setInputValue((prev) => (prev ? `${prev}\n${fileList}` : fileList));
    }
    e.target.value = "";
  };

  const handleUrlInsert = () => {
    if (urlValue.trim()) {
      setInputValue((prev) => (prev ? `${prev}\n${urlValue.trim()}` : urlValue.trim()));
      setUrlValue("");
    }
  };

  const allMessages = [
    ...messages.map((m) => ({ ...m, isStatic: true })),
    ...chat.messages.map((m) => ({
      id: m.id,
      align: m.role === "user" ? ("end" as const) : ("start" as const),
      text: m.content,
      textKey: "",
      time: new Date().toISOString(),
      isStatic: false,
      reaction: undefined,
    })),
  ];

  const _selectedModel = availableModels.find((m) => m.id === chat.selectedModel) ?? availableModels[0];

  const contactName = contact?.name ?? currentUser.name;
  const contactRole = contact?.role ?? "";

  return (
    <div className={cn("flex h-full flex-col py-3", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label={t("chat.backToConversations")}
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Avatar className="size-8">
              <AvatarFallback className="bg-background text-foreground">{getInitials(contactName)}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            <div>
              <div className="font-medium text-sm">{contactName}</div>
              <div className="text-muted-foreground text-xs leading-3">{contactRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("chat.call")}>
                  <PhoneCall />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("chat.call")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("chat.tag")}>
                  <Tag />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("chat.tag")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("chat.snooze")}>
                  <AlarmClock />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("chat.snooze")}</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("chat.moreActions")}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={onOpenContact}>
                    <UserRound />
                    {t("chat.viewProfile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy />
                    {t("chat.copyEmail")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag />
                    {t("chat.markPriority")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">{t("chat.blockContact")}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />
      </div>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-6 px-2 py-8">
              {messages[0] && (
                <Marker variant="separator">
                  <MarkerContent>{formatChatFullDate(messages[0].time, locale)}</MarkerContent>
                </Marker>
              )}

              {allMessages.map((message) => {
                const isOutbound = message.align === "end";
                const reactionAlign = isOutbound ? "start" : "end";
                const senderName = isOutbound ? currentUser.name : contactName;

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={String(message.id)}
                    scrollAnchor={message.align === "end"}
                  >
                    <Message align={message.align}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarFallback
                            className={cn(
                              "bg-muted text-foreground text-xs",
                              isOutbound && "bg-primary text-primary-foreground",
                            )}
                          >
                            {isOutbound ? "MM" : getInitials(senderName)}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>

                      <MessageContent>
                        <BubbleGroup>
                          <Bubble variant={isOutbound ? "default" : "muted"} align={message.align}>
                            <BubbleContent>{message.isStatic ? t(message.textKey) : message.text}</BubbleContent>
                            {message.reaction ? (
                              <BubbleReactions
                                aria-label={t("chat.reactionAria", { reaction: message.reaction })}
                                align={reactionAlign}
                              >
                                <span>{message.reaction}</span>
                              </BubbleReactions>
                            ) : null}
                          </Bubble>
                        </BubbleGroup>
                        <MessageFooter>{formatChatTime(message.time, locale, t)}</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}

              {chat.isLoading && (
                <MessageScrollerItem messageId="loading" scrollAnchor>
                  <Message align="start">
                    <MessageAvatar>
                      <Avatar>
                        <AvatarFallback className="bg-muted text-foreground text-xs">AI</AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <BubbleGroup>
                        <Bubble variant="muted" align="start">
                          <BubbleContent className="flex gap-1">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse [animation-delay:0.2s]">.</span>
                            <span className="animate-pulse [animation-delay:0.4s]">.</span>
                          </BubbleContent>
                        </Bubble>
                      </BubbleGroup>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="px-2">
        <Tabs defaultValue="reply" className="gap-0 rounded-md border">
          <TabsList
            variant="line"
            className="w-full justify-start gap-2 border-b px-3 **:data-[slot=tabs-trigger]:border-x-0 **:data-[slot=tabs-trigger]:px-6 group-data-horizontal/tabs:h-10"
          >
            <TabsTrigger value="reply" className="flex-none px-1">
              {t("chat.reply")}
            </TabsTrigger>
            <TabsTrigger value="note" className="flex-none px-1">
              {t("chat.internalNote")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reply" className="m-0">
            <form onSubmit={handleSubmit}>
              <InputGroup className="border-0 bg-background shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot][aria-invalid=true]]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:ring-0">
                <InputGroupTextarea
                  placeholder={t("chat.typeMessage")}
                  className="max-h-40 min-h-14 overflow-y-auto px-3 py-2.5 text-sm ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:aria-invalid:ring-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={chat.isLoading}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton aria-label={t("chat.format")} type="button" size="icon-sm">
                    <Type />
                  </InputGroupButton>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                  <InputGroupButton
                    aria-label={t("chat.attachFile")}
                    type="button"
                    size="icon-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip />
                  </InputGroupButton>
                  <Dialog>
                    <DialogTrigger asChild>
                      <InputGroupButton aria-label={t("chat.insertLink")} type="button" size="icon-sm">
                        <Globe />
                      </InputGroupButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Inserir link</DialogTitle>
                        <DialogDescription>Cole a URL que deseja adicionar à mensagem.</DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="https://exemplo.com"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUrlInsert();
                          }
                        }}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleUrlInsert}>Inserir</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton type="button" size="icon-sm" variant="outline">
                        <Sparkles />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72 p-0">
                      <div className="border-b px-3 py-2">
                        <Input
                          placeholder="Buscar modelo..."
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          className="h-8 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
                        />
                      </div>
                      <ScrollArea className="h-72">
                        <div className="py-1">
                          {groupedModels.length === 0 ? (
                            <div className="px-3 py-6 text-center text-muted-foreground text-sm">
                              {availableModels.length === 0 ? "Nenhum modelo disponível" : "Nenhum modelo encontrado"}
                            </div>
                          ) : (
                            groupedModels.map((group) => (
                              <div key={group.providerId}>
                                <div className="px-3 py-1.5 font-medium text-muted-foreground text-xs">
                                  {group.provider}
                                </div>
                                {group.models.map((model) => (
                                  <button
                                    key={model.id}
                                    type="button"
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-accent"
                                    onClick={() => {
                                      chat.setSelectedModel(model.id);
                                      setModelSearch("");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "size-4 shrink-0",
                                        chat.selectedModel === model.id ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    <span className="truncate">{model.name}</span>
                                  </button>
                                ))}
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                      <div className="border-t">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-muted-foreground text-sm hover:bg-accent hover:text-foreground"
                          onClick={() => {
                            router.push("/dashboard/settings/models");
                          }}
                        >
                          <Settings className="size-4" />
                          Gerenciar modelos
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    className="ml-auto"
                    disabled={chat.isLoading || !inputValue.trim()}
                  >
                    <Send />
                    <span className="sr-only">{t("chat.send")}</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </TabsContent>
          <TabsContent value="note" className="m-0">
            <MessageComposer placeholder={t("chat.writeInternalNote")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MessageComposer({ placeholder }: { placeholder: string }) {
  const t = useTranslations();

  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <InputGroup className="border-0 bg-background shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot][aria-invalid=true]]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:ring-0">
        <InputGroupTextarea
          placeholder={placeholder}
          className="max-h-40 min-h-14 overflow-y-auto px-3 py-2.5 text-sm ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:aria-invalid:ring-0"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton aria-label={t("chat.format")} type="button" size="icon-sm">
            <Type />
          </InputGroupButton>
          <InputGroupButton aria-label={t("chat.attachFile")} type="button" size="icon-sm">
            <Paperclip />
          </InputGroupButton>
          <InputGroupButton aria-label={t("chat.insertLink")} type="button" size="icon-sm">
            <Globe />
          </InputGroupButton>
          <InputGroupButton type="submit" variant="default" size="icon-sm" className="ml-auto">
            <Send />
            <span className="sr-only">{t("chat.send")}</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
