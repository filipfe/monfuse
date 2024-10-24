import getDictionary, { langs } from "@/dict";
import Skeleton from "@/components/services/skeleton";
import GoalCard from "@/components/landing/cards/goal";
import FAQ from "@/components/landing/faq";
import { Metadata } from "next";
import Description from "@/components/services/description";
import metadata, { openGraph } from "@/app/shared-metadata";

export async function generateMetadata({
  params: { lang },
}: PageProps): Promise<Metadata> {
  const {
    services: {
      items: {
        goals: { _metadata },
      },
    },
  } = await getDictionary(lang);
  return {
    ..._metadata,
    ...metadata,
    openGraph: {
      ..._metadata,
      url: new URL(`https://www.monfuse.com/${lang}/goals`),
      locale: lang,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${lang}/goals`),
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}/goals`,
        }),
        {}
      ),
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
      <Description />
      <FAQ dict={{ title: faqTitle, items: goals.faq }} />
    </div>
  );
}
