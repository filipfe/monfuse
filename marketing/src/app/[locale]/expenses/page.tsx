import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import { Metadata } from "next";
import FAQ from "@/components/landing/faq";
import ExpensesCard from "@/components/landing/cards/expenses";
import metadata, { openGraph } from "@/app/shared-metadata";
import Description from "@/components/services/description";
import { LOCALES } from "@/lib/locales";
import { getLang } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
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
      url: new URL(`https://www.monfuse.com/${locale}/expenses`),
      locale,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/expenses`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${locale}/expenses`,
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
      items: { expenses },
    },
    landing: {
      hero: { cta },
      faq: dictFaq,
    },
    general: {
      card: { expense: dictExpenseCard },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...expenses, cta }}>
        <ExpensesCard dict={dictExpenseCard} />
      </Skeleton>
      {expenses.info.map((section, k) => (
        <Description
          rtl={k % 2 !== 0}
          dict={section}
          image={{
            src: "/app/expenses.png",
            alt: expenses.image.alt,
          }}
          key={`info-${k}`}
        />
      ))}
      <FAQ dict={{ ...dictFaq, items: expenses.faq }} />
    </div>
  );
}
