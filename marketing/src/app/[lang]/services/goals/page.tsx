import getDictionary from "@/dict";
import Skeleton from "@/components/services/skeleton";
import GoalCard from "@/components/landing/cards/goal";
import FAQ from "@/components/landing/faq";
import { Metadata } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import Description from "@/components/services/description";

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
      <Description />
      <FAQ dict={{ title: faqTitle, items: goals.faq }} />
    </div>
  );
}
