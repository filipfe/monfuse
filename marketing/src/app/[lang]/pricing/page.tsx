import FAQ from "@/components/landing/faq";
import Pricing from "@/components/pricing";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const {
    pricing,
    landing: { faq: dictFaq, pricing: landingPricing },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <Pricing dict={landingPricing} lang={lang} />
      <FAQ dict={{ ...dictFaq, items: pricing.faq }} />
    </div>
  );
}
