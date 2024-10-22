import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import { Metadata } from "next";
import FAQ from "@/components/landing/faq";
import ExpensesCard from "@/components/landing/cards/expenses";

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
    openGraph: {
      ..._metadata,
      url: new URL(`https://www.monfuse.com/${lang}/services/expenses`),
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
      <FAQ dict={{ title: faqTitle, items: expenses.faq }} />
    </div>
  );
}
