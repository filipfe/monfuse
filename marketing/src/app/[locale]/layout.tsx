import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/header/content";
import Footer from "@/components/ui/footer";
import Banner from "@/components/ui/banner";
import getDictionary from "@/dict";
import { SpeedInsights } from "@vercel/speed-insights/next";
import metadata, { openGraph } from "../shared-metadata";
import { Analytics } from "@vercel/analytics/react";
import { cn, getLang } from "@/lib/utils";
import Script from "next/script";
import { LOCALES } from "@/lib/locales";

const inter = Inter({ subsets: ["latin"] });

// const IBMPlexMono = IBM_Plex_Mono({
//   weight: ["400"],
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const { _metadata } = await getDictionary(lang);
  return {
    ..._metadata,
    ...metadata,
    openGraph: {
      title: _metadata.title,
      description: _metadata.description,
      url: new URL(`https://www.monfuse.com/${locale}`),
      locale,
      ...openGraph,
    },
    twitter: {
      title: _metadata.title,
      description: _metadata.description,
      card: "summary_large_image",
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}`),
      languages: LOCALES.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${locale}`,
        }),
        {}
      ),
    },
  };
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const [lang] = locale.split("-");
  const dict = await getDictionary(lang as Lang);
  const { banner } = dict;
  return (
    <html lang={lang} className="light">
      <body className={cn(inter.className)}>
        <Header dict={dict} />
        <main>{children}</main>
        <Banner dict={{ ...banner, card: dict.general.card }} />
        <Footer dict={dict} />
        <SpeedInsights />
        <Analytics />
        <Script strategy="beforeInteractive" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            image: "https://www.monfuse.com/opengraph-image.png",
            url: "https://www.monfuse.com",
            // "logo": "https://www.example.com/images/logo.png",
            name: "Monfuse",
            description:
              "Finance app allowing to track incomes, expenses, recurring payments, financial goals, manage spending limits and get insights from AI Assistant",
            // email: "contact@example.com",
            // telephone: "+47-99-999-9999",
            // address: {
            //   "@type": "PostalAddress",
            //   streetAddress: "Rue Improbable 99",
            //   addressLocality: "Paris",
            //   addressCountry: "FR",
            //   addressRegion: "Ile-de-France",
            //   postalCode: "75001",
            // },
            // vatID: "FR12345678901",
            // iso6523Code: "0199:724500PMK2A2M1SQQ228",
          })}
        </Script>
      </body>
    </html>
  );
}
