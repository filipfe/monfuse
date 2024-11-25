import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import FAQ from "@/components/landing/faq";
import IncomeCard from "@/components/landing/cards/income";
import { Metadata } from "next";
import metadata, { openGraph } from "@/app/shared-metadata";
import Description from "@/components/services/description";
import { getLang } from "@/lib/utils";
import { LOCALES } from "@/lib/locales";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const {
    services: { items },
  } = await getDictionary(lang);
  return {
    ...items["recurring-payments"]._metadata,
    ...metadata,
    openGraph: {
      ...items["recurring-payments"]._metadata,
      url: new URL(`https://www.monfuse.com/${locale}/recurring-payments`),
      locale: lang,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(
        `https://www.monfuse.com/${locale}/recurring-payments`
      ),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${locale}/recurring-payments`,
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
    services: { items },
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
      <Skeleton dict={{ ...items["recurring-payments"], cta }}>
        <IncomeCard dict={dictIncomeCard} />
      </Skeleton>
      {items["recurring-payments"].info.map((section, k) => (
        <Description
          rtl={k % 2 !== 0}
          dict={section}
          image={{
            src: "/app/recurring-payments.png",
            alt: items["recurring-payments"].image.alt,
          }}
          key={`info-${k}`}
        />
      ))}
      <FAQ dict={{ ...dictFaq, items: items["recurring-payments"].faq }} />
    </div>
  );
}
