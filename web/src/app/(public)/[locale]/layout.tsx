import { LOCALES } from "@/const/locales";
import getLang from "@/utils/get-lang";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    openGraph: {
      url: new URL(`https://app.monfuse.com/${locale}`),
      locale,
    },
    alternates: {
      canonical: new URL(`https://app.monfuse.com/${locale}`),
      languages: LOCALES.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://app.monfuse.com/${locale}`,
        }),
        {}
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
