import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import GoalCard from "@/components/landing/cards/goal";
import FAQ from "@/components/landing/faq";
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
      url: new URL(`https://www.monfuse.com/${lang}/services/goals`),
    },
  };
}

export default async function Page({ params: { lang } }: PageProps) {
  const {
    services: {
      items: { goals },
    },
    landing: {
      hero: { cta },
      faq: { title: faqTitle },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...goals, cta }}>
        <GoalCard />
      </Skeleton>
      <FAQ dict={{ title: faqTitle, items: goals.faq }} />
    </div>
  );
}
