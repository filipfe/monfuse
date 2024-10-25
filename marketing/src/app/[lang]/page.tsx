import AIAssistant from "@/components/landing/ai-assistant";
import BentoGrid from "@/components/landing/bento-grid";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import Services from "@/components/landing/services";
import Operations from "@/components/landing/operations";
import Pricing from "@/components/pricing";
import getDictionary from "@/dict";

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const {
    landing: { hero, operations, faq, services, ...dict },
  } = await getDictionary(lang);
  return (
    <div>
      <Hero dict={hero} />
      <Operations dict={operations} />
      <BentoGrid />
      <Services dict={services} />
      <AIAssistant dict={dict["ai-assistant"]} />
      <Pricing />
      <FAQ dict={faq} />
    </div>
  );
}
