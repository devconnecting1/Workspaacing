import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatCurrencyOptions = Intl.NumberFormatOptions & {
  noDecimals?: boolean;
};

export function formatCurrency(value: number, options: FormatCurrencyOptions = {}, locale = "pt-BR"): string {
  const { noDecimals, ...rest } = options;
  if (noDecimals) {
    rest.maximumFractionDigits = 0;
    rest.minimumFractionDigits = 0;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    ...rest,
  }).format(value);
}

export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
