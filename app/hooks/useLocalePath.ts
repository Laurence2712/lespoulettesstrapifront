import { useOutletContext, useParams } from "@remix-run/react";

interface LocaleContext {
  locale: string;
}

export function useLocalePath() {
  const context = useOutletContext<LocaleContext | null>();
  const params = useParams();
  const locale = context?.locale ?? params.locale ?? "fr";
  return (path: string) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function useLocale() {
  const context = useOutletContext<LocaleContext | null>();
  const params = useParams();
  return context?.locale ?? params.locale ?? "fr";
}
