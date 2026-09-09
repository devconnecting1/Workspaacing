import { cookies } from "next/headers";

import { IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value === "en" ? "en" : "pt-BR";

  const [en, ptBR] = await Promise.all([import("../../messages/en.json"), import("../../messages/pt-BR.json")]);

  return {
    locale,
    timeZone: "America/Sao_Paulo",
    messages: locale === "en" ? en.default : { ...en.default, ...ptBR.default },
    onError(error) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      }
    },
    getMessageFallback({ key }) {
      return key;
    },
  };
});
