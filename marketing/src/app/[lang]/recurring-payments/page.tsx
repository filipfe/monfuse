import getDictionary, { langs } from "@/dict";
import Skeleton from "@/components/services/skeleton";
import FAQ from "@/components/landing/faq";
import IncomeCard from "@/components/landing/cards/income";
import { Metadata } from "next";
import metadata, { openGraph } from "@/app/shared-metadata";
import Description from "@/components/services/description";

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
      canonical: new URL(`https://www.monfuse.com/${lang}/recurring-payments`),
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
            alt: "Recurring payments interface showcasing active, latest and upcoming payments along with calendar",
          }}
          key={`info-${k}`}
        />
      ))}
      <FAQ dict={{ ...dictFaq, items: items["recurring-payments"].faq }} />
    </div>
  );
}
