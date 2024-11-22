import { LOCALES } from "@/const/locales";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";

const defaultLocale = "en-US";

export default function getLocale(req: NextRequest) {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => (headers[key] = value));
  const languages = new Negotiator({ headers }).languages();
  const locale = match(languages, LOCALES, defaultLocale);
  return locale as Locale;
}
