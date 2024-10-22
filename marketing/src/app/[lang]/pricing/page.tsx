import FAQ from "@/components/landing/faq";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";

export default async function Page({ params: { lang } }: PageProps) {
  const { pricing, landing } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <FAQ dict={{ title: landing.faq.title, items: pricing.faq }} />
    </div>
  );
}
