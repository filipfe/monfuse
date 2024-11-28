import metadata, { openGraph, twitter } from "@/app/shared-metadata";
import FAQ from "@/components/landing/faq";
import Pricing from "@/components/pricing";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";
import { LOCALES } from "@/lib/locales";
import { getLang } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const dict = await getDictionary(lang);
  return {
    ...metadata,
    ...dict["pricing"]._metadata,
    openGraph: {
      ...openGraph,
      ...dict["pricing"]._metadata,
      url: new URL(`https://www.monfuse.com/${locale}/pricing`),
      locale: locale.replace("-", "_"),
    },
    twitter: { ...twitter, ...dict["pricing"]._metadata },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/pricing`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/pricing`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLang(locale);
  const {
    pricing,
    landing: { faq: dictFaq, pricing: landingPricing },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <Pricing dict={landingPricing} locale={locale} />
      <FAQ dict={{ ...dictFaq, items: pricing.faq }} />
    </div>
  );
}
