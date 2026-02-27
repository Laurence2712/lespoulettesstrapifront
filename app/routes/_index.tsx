import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_LOCALE, LOCALES } from "../i18n";
import type { Locale } from "../i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  const acceptLanguage = request.headers.get("Accept-Language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find((l) => LOCALES.includes(l as Locale)) as Locale | undefined;

  return redirect(`/${preferred ?? DEFAULT_LOCALE}/`, { status: 302 });
}

export default function Index() {
  return null;
}
