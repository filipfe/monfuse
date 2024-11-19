import FAQ from "@/components/landing/faq";
import Pricing from "@/components/pricing";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";
import { getLang } from "@/lib/utils";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLang(locale);
  const {
    pricing,
    landing: { faq: dictFaq, pricing: landingPricing },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <Pricing dict={landingPricing} locale={locale} />
      <FAQ dict={{ ...dictFaq, items: pricing.faq }} />
    </div>
  );
}