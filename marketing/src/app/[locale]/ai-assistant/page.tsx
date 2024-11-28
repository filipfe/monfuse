import metadata, { openGraph } from "@/app/shared-metadata";
import AIAssistant from "@/components/landing/ai-assistant";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";
import { LOCALES } from "@/lib/locales";
import { getLang } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const dict = await getDictionary(lang);
  return {
    ...dict["ai-assistant"]._metadata,
    ...metadata,
    openGraph: {
      ...openGraph,
      ...dict["ai-assistant"]._metadata,
      url: new URL(`https://www.monfuse.com/${locale}/ai-assistant`),
      locale: locale.replace("-", "_"),
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/ai-assistant`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/ai-assistant`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLang(locale);
  const dict = await getDictionary(lang);
  return (
    <div>
      <Skeleton
        dict={{ ...dict["ai-assistant"], cta: dict.landing.hero.cta }}
      />
      <AIAssistant dict={dict.landing["ai-assistant"]} />
    </div>
  );
}
