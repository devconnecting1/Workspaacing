"use client";

import * as React from "react";

import { format, subDays } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const t = useTranslations("analyticsV1");
  const locale = useLocale();
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;
  const [open, setOpen] = React.useState(false);
  const [internalDateRange, setInternalDateRange] = React.useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = subDays(to, 29);
    return { from, to };
  });
  const dateRange = value ?? internalDateRange;
  let dateRangeLabel = t("selectDate");

  if (dateRange?.from) {
    dateRangeLabel = format(dateRange.from, "d MMM yyyy", { locale: dateFnsLocale });
  }

  if (dateRange?.from && dateRange.to) {
    dateRangeLabel = `${format(dateRange.from, "d MMM yyyy", { locale: dateFnsLocale })} - ${format(dateRange.to, "d MMM yyyy", { locale: dateFnsLocale })}`;
  }

  const handleDateChange = (nextValue: DateRange | undefined) => {
    if (!value) {
      setInternalDateRange(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" id="date" className="font-normal">
          {dateRangeLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateChange}
          numberOfMonths={2}
          locale={dateFnsLocale}
        />
      </PopoverContent>
    </Popover>
  );
}
