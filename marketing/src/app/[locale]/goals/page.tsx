import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import GoalCard from "@/components/landing/cards/goal";
import FAQ from "@/components/landing/faq";
import { Metadata } from "next";
import Description from "@/components/services/description";
import metadata, { openGraph } from "@/app/shared-metadata";
import { getLang } from "@/lib/utils";
import { LOCALES } from "@/lib/locales";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
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
      ...openGraph,
      url: new URL(`https://www.monfuse.com/${locale}/goals`),
      locale: locale.replace("-", "_"),
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/goals`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/goals`,
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
      items: { goals },
    },
    landing: {
      hero: { cta },
      faq: dictFaq,
    },
    general: {
      card: { goal: dictGoalCard },
    },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={{ ...goals, cta }}>
        <GoalCard dict={dictGoalCard} />
      </Skeleton>
      <Description
        dict={goals.info}
        image={{
          src: "/app/goals.png",
          alt: goals.image.alt,
        }}
      />
      <FAQ dict={{ ...dictFaq, items: goals.faq }} />
    </div>
  );
}
