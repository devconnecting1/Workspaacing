"use client";

import { type ReactNode, useState } from "react";

import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleCardSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly defaultOpen?: boolean;
  readonly children: ReactNode;
}

export function CollapsibleCardSection({
  title,
  description,
  defaultOpen = false,
  children,
}: CollapsibleCardSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-t border-border px-6 py-4">
        <CollapsibleTrigger className="flex w-full items-center gap-2 text-left">
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">{title}</span>
        </CollapsibleTrigger>
        {description && !open && <p className="mt-1 ml-6 text-muted-foreground text-xs">{description}</p>}
      </div>
      <CollapsibleContent>
        <div className="space-y-4 px-6 pb-4">
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
