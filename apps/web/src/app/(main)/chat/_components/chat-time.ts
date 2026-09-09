import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { enUS, ptBR } from "date-fns/locale";

const timeZone = "America/Sao_Paulo";

const clockFormatter = (locale: string) =>
  new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });

const fullDateFormatter = (locale: string) =>
  new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  });

const dayKeyFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone,
});

const isSameDay = (a: Date, b: Date) => dayKeyFormatter.format(a) === dayKeyFormatter.format(b);

type Translate = (key: string) => string;

export function formatChatTime(value: string, locale: string, t: Translate) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const dateFnsLocale = locale === "pt-BR" ? ptBR : enUS;

  if (diffMs < 60_000) {
    return t("chat.justNow");
  }

  if (diffMs < 3_600_000) {
    return formatDistanceToNow(date, { addSuffix: true, locale: dateFnsLocale });
  }

  if (isSameDay(new Date(), date)) {
    return clockFormatter(locale).format(date);
  }

  if (isSameDay(new Date(Date.now() - 86_400_000), date)) {
    return t("chat.timeYesterday");
  }

  return fullDateFormatter(locale).format(date);
}

export function formatChatFullDate(value: string, locale: string) {
  return fullDateFormatter(locale).format(new Date(value));
}
