import getDictionary, { langs } from "@/dict";
import Skeleton from "@/components/services/skeleton";
import FAQ from "@/components/landing/faq";
import IncomeCard from "@/components/landing/cards/income";
import { Metadata } from "next";
import metadata, { openGraph } from "@/app/shared-metadata";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const {
    services: { items },
  } = await getDictionary(lang);
  return {
    ...items["recurring-payments"]._metadata,
    ...metadata,
    openGraph: {
      ...items["recurring-payments"]._metadata,
      url: new URL(`https://www.monfuse.com/${lang}/recurring-payments`),
      locale: lang,
      ...openGraph,
    },
    alternates: {
      canonical: new URL("https://www.monfuse.com/recurring-payments"),
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}/recurring-payments`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const {
    services: { items },
    landing: {
      hero: { cta },
      faq: { title: faqTitle },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...items["recurring-payments"], cta }}>
        <IncomeCard />
      </Skeleton>
      <FAQ dict={{ title: faqTitle, items: items["recurring-payments"].faq }} />
    </div>
  );
}
