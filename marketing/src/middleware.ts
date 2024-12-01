import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { LOCALES } from "./lib/locales";

const defaultLocale = "en-US";

// Get the preferred locale, similar to the above or using a library
function getLocale(req: NextRequest): Locale {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => (headers[key] = value));
  const languages = new Negotiator({ headers }).languages();
  const locale = match(languages, LOCALES, defaultLocale);
  return locale as Locale;
}

export function middleware(req: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = req.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  let locale: Locale;
  try {
    locale = getLocale(req);
  } catch (err) {
    console.warn("Couldn't retrieve locale: ", err);
    locale = defaultLocale;
  }
  req.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
