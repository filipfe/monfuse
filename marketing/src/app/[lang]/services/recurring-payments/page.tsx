import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import FAQ from "@/components/landing/faq";
import IncomeCard from "@/components/landing/cards/income";
import { Metadata } from "next";

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
      url: new URL(
        `https://www.monfuse.com/${lang}/services/recurring-payments`
      ),
    },
  };
}

export default async function Page({ params: { lang } }: PageProps) {
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
