import getDictionary, { langs } from "@/dict";
import Skeleton from "@/components/services/skeleton";
import { Metadata } from "next";
import FAQ from "@/components/landing/faq";
import ExpensesCard from "@/components/landing/cards/expenses";
import metadata, { openGraph } from "@/app/shared-metadata";
import Description from "@/components/services/description";

export async function generateMetadata({
  params: { lang },
}: PageProps): Promise<Metadata> {
  const {
    services: {
      items: {
        expenses: { _metadata },
      },
    },
  } = await getDictionary(lang);
  return {
    ..._metadata,
    ...metadata,
    openGraph: {
      ..._metadata,
      url: new URL(`https://www.monfuse.com/${lang}/expenses`),
      locale: lang,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${lang}/expenses`),
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}/expenses`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params: { lang } }: PageProps) {
  const {
    services: {
      items: { expenses },
    },
    landing: {
      hero: { cta },
      faq: { title: faqTitle },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...expenses, cta }}>
        <ExpensesCard />
      </Skeleton>
      <Description />
      <Description />
      <Description />
      <FAQ dict={{ title: faqTitle, items: expenses.faq }} />
    </div>
  );
}
