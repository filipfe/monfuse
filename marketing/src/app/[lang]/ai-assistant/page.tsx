import metadata, { openGraph } from "@/app/shared-metadata";
import AIAssistant from "@/components/landing/ai-assistant";
import Skeleton from "@/components/services/skeleton";
import getDictionary, { langs } from "@/dict";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    ...dict["ai-assistant"]._metadata,
    ...metadata,
    openGraph: {
      ...dict["ai-assistant"]._metadata,
      url: new URL(`https://www.monfuse.com/${lang}/ai-assistant`),
      locale: lang,
      ...openGraph,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${lang}/ai-assistant`),
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}/ai-assistant`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
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
