import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import FAQ from "@/components/landing/faq";
import IncomeCard from "@/components/landing/cards/income";
import { Metadata } from "next";
import metadata, { openGraph } from "@/app/shared-metadata";
import { getLang } from "@/lib/utils";
import { LOCALES } from "@/lib/locales";
import Description from "@/components/services/description";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const {
    services: {
      items: {
        incomes: { _metadata },
      },
    },
  } = await getDictionary(lang);
  return {
    ..._metadata,
    ...metadata,
    openGraph: {
      ..._metadata,
      url: new URL(`https://www.monfuse.com/${locale}/incomes`),
      locale,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/incomes`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/incomes`,
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
    services: {
      items: { incomes },
    },
    landing: {
      hero: { cta },
      faq: dictFaq,
    },
    general: {
      card: { income: dictIncomeCard },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...incomes, cta }}>
        <IncomeCard dict={dictIncomeCard} />
      </Skeleton>
      <Description
        dict={incomes.info}
        image={{
          src: "/app/incomes.png",
          alt: incomes.image.alt,
        }}
      />
      <FAQ dict={{ ...dictFaq, items: incomes.faq }} />
    </div>
  );
}
