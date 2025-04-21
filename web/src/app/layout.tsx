import type { Metadata } from "next";
import "./globals.css";
import { satoshi } from "@/assets/font/satoshi";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { LOCALES } from "@/const/locales";
import "ldrs/react/Hatch.css";
import "ldrs/react/Ring.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    openGraph: {
      url: new URL(`https://app.monfuse.com`),
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(`https://app.monfuse.com`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://app.monfuse.com/${locale}`,
        }),
        {}
      ),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={satoshi.className}>
        <Script
          type="module"
          defer
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/hatch.js"
        ></Script>
        <Script
          type="module"
          defer
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/bouncy.js"
        ></Script>
        {children}
        <NextTopLoader color="#177981" showSpinner={false} />
        <Toaster toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
