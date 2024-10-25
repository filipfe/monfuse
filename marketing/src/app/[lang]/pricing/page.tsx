import FAQ from "@/components/landing/faq";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const { pricing, landing } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <FAQ dict={{ title: landing.faq.title, items: pricing.faq }} />
    </div>
  );
}
