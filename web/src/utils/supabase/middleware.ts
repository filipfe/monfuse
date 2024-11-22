import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import getLocale from "../get-locale";

const LOCALE_ROUTES = [
  "/account-setup",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
];

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth/confirm",
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data: user } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, ...settings(currency, timezone, language)",
    )
    .single();

  // User tried accessing private path without being authenticated

  if (
    !user &&
    !PUBLIC_ROUTES.includes(request.nextUrl.pathname) &&
    !PUBLIC_ROUTES.includes(
      "/" + request.nextUrl.pathname.split("/").slice(2).join("/"),
    )
  ) {
    const url = request.nextUrl.clone();
    const locale = getLocale(request);
    url.pathname = `/${locale}/sign-in`;
    return NextResponse.redirect(url);
  }

  if (user) {
    // User tried accessing public path being authenticated
    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    const isAccountSetup = !!user.first_name &&
      !!user.last_name &&
      !!user.currency &&
      !!user.language &&
      !!user.timezone;

    if (
      request.nextUrl.pathname.endsWith("/account-setup") && !isAccountSetup
    ) {
      return supabaseResponse;
    }

    if (!isAccountSetup) {
      const locale = getLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/account-setup`;
      return NextResponse.redirect(url);
    }

    if (
      request.nextUrl.pathname === "/settings/subscription" ||
      process.env.NODE_ENV !== "production"
    ) {
      return supabaseResponse;
    }

    const supabaseServiceRole = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data: subscription, error } = await supabaseServiceRole
      .schema("stripe")
      .from("subscriptions")
      .select("attrs")
      .eq("customer", user.id)
      .maybeSingle();

    if (error) {
      const url = request.nextUrl.clone();
      url.pathname = "/settings/subscription";
      return NextResponse.redirect(url);
    }

    const isActive = subscription &&
      (subscription.attrs.status === "active" ||
        subscription.attrs.status === "trialing");

    if (!isActive) {
      const url = request.nextUrl.clone();
      url.pathname = "/settings/subscription";
      return NextResponse.redirect(url);
    }
  }

  // User accesses public path with locale
  if (LOCALE_ROUTES.includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    const locale = getLocale(request);
    url.pathname = `/${locale}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
