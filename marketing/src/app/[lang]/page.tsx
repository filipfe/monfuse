import AIAssistant from "@/components/landing/ai-assistant";
import BentoGrid from "@/components/landing/bento-grid";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import Services from "@/components/landing/services";
import Operations from "@/components/landing/operations";
import getDictionary from "@/dict";
import Pricing from "@/components/pricing";

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const {
    landing: dict,
    general: { card: dictCard },
  } = await getDictionary(lang);
  return (
    <div>
      <Hero dict={{ ...dict.hero, card: dictCard }} />
      <Operations dict={dict.operations} />
      <BentoGrid dict={{ ...dict["bento-grid"], card: dictCard }} />
      <Services dict={dict.services} />
      <AIAssistant dict={dict["ai-assistant"]} />
      <Pricing dict={dict.pricing} />
      <FAQ dict={dict.faq} />
    </div>
  );
}
