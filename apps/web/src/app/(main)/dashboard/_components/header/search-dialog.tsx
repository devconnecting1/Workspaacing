"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { NavMainItem } from "@/navigation/sidebar/sidebar-items";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

type SearchItem = {
  id: string;
  group: string;
  groupKey?: string;
  label: string;
  labelKey?: string;
  url: string;
  icon?: NavMainItem["icon"];
  disabled?: boolean;
  newTab?: boolean;
};

const sidebarGroupLabelKeys = new Set(sidebarItems.flatMap((group) => (group.labelKey ? [group.labelKey] : [])));

function getSubItemGroup(groupLabelKey: string | undefined, itemTitleKey: string | undefined) {
  return itemTitleKey && sidebarGroupLabelKeys.has(itemTitleKey) ? (groupLabelKey ?? "other") : itemTitleKey;
}

const searchItems: SearchItem[] = sidebarItems.flatMap((group) =>
  group.items.flatMap((item) => {
    if (item.subItems) {
      return item.subItems.map((sub) => ({
        id: sub.id,
        group: getSubItemGroup(group.labelKey, item.titleKey) ?? "other",
        groupKey: getSubItemGroup(group.labelKey, item.titleKey),
        label: sub.title,
        labelKey: sub.titleKey,
        url: sub.url,
        icon: item.icon,
        disabled: sub.disabled,
        newTab: sub.newTab,
      }));
    }
    return [
      {
        id: item.id,
        group: group.labelKey ?? "other",
        groupKey: group.labelKey,
        label: item.title,
        labelKey: item.titleKey,
        url: item.url,
        icon: item.icon,
        disabled: item.disabled,
        newTab: item.newTab,
      },
    ];
  }),
);

function getAvailableItems(items: SearchItem[]) {
  return items.filter((item) => !item.disabled && !item.url.includes("coming-soon"));
}

const recommendations = getAvailableItems(searchItems);

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }));
}

export function SearchDialog() {
  const t = useTranslations("shell");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery("");
  };

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return;
    handleOpenChange(false);
    if (item.newTab) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => {
      const groupHeading = t(group);
      return (
        <React.Fragment key={group}>
          {index > 0 && <CommandSeparator />}
          <CommandGroup heading={groupHeading}>
            {groupItems.map((item) => {
              const itemLabel = item.labelKey ? t(item.labelKey) : item.label;
              return (
                <CommandItem
                  disabled={item.disabled}
                  key={`${group}-${item.id}`}
                  value={`${groupHeading} ${itemLabel}`}
                  onSelect={() => handleSelect(item)}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {item.icon && <item.icon />}
                    <span className="truncate">{itemLabel}</span>
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </React.Fragment>
      );
    });

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        {t("searchLabel")}
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={t("commandTitle")}
        description={t("commandDescription")}
      >
        <Command>
          <CommandInput placeholder={t("searchPlaceholder")} value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{t("noResults")}</CommandEmpty>
            {query ? renderGroups(searchItems) : renderGroups(recommendations)}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
