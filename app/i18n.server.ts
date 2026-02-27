import { createCookie } from "@remix-run/node";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next/server";
import { i18nConfig } from "./i18n";

export const localeCookie = createCookie("locale", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
});

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18nConfig.supportedLngs as unknown as string[],
    fallbackLanguage: i18nConfig.fallbackLng,
  },
  i18next: {
    ...i18nConfig,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  plugins: [Backend],
});

export default i18next;
