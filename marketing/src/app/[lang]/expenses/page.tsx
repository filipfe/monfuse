import getDictionary, { langs } from "@/dict";
import Skeleton from "@/components/services/skeleton";
import { Metadata } from "next";
import FAQ from "@/components/landing/faq";
import ExpensesCard from "@/components/landing/cards/expenses";
import metadata, { openGraph } from "@/app/shared-metadata";
import Description from "@/components/services/description";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
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

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
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
      {expenses.info.map((section, k) => (
        <Description
          rtl={k % 2 !== 0}
          dict={section}
          image={{
            src: "/app/expenses.png",
            alt: "Expenses page with categorized transactions and limits.",
          }}
          key={`info-${k}`}
        />
      ))}
      <FAQ dict={{ title: faqTitle, items: expenses.faq }} />
    </div>
  );
}
