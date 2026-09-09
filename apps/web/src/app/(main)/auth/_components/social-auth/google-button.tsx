import { getTranslations } from "next-intl/server";
import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const t = await getTranslations("auth.form");

  return (
    <Button variant="secondary" className={cn(className)} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      {t("continueWithGoogle")}
    </Button>
  );
}
