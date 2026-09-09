import { mails } from "@/app/(main)/mail/_components/data";
import { MailComponent } from "@/app/(main)/mail/_components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "@/app/(main)/mail/_components/mail-layout-config";
import { getValueFromCookie } from "@/server/server-actions";

export default async function Page() {
  const layoutCookie = await getValueFromCookie(MAIL_LAYOUT_COOKIE);

  return (
    <div className="mx-auto h-full w-full max-w-5xl overflow-hidden rounded-lg border bg-background shadow-sm">
      <MailComponent mails={mails} defaultLayout={layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT]} />
    </div>
  );
}
