import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next/react";
import { LOCALES, DEFAULT_LOCALE } from "../i18n";
import i18next from "../i18n.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = params.locale as string;

  // Redirect invalid locales to default
  if (!LOCALES.includes(locale as any)) {
    const url = new URL(request.url);
    const path = url.pathname.replace(`/${locale}`, "");
    const search = url.search;
    throw redirect(`/${DEFAULT_LOCALE}${path || "/"}${search}`);
  }

  const t = await i18next.getFixedT(locale, "common");
  const title = t("meta.home_title");

  return json({ locale, title });
}

export const handle = { i18n: "common" };

export default function LocaleLayout() {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale);
  return <Outlet context={{ locale }} />;
}
