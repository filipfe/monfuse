import FAQ from "@/components/landing/faq";
import Skeleton from "@/components/services/skeleton";
import getDictionary from "@/dict";

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const {
    pricing,
    landing: { faq: dictFaq },
  } = await getDictionary(lang);
  return (
    <div>
      <Skeleton dict={pricing} />
      <FAQ dict={{ ...dictFaq, items: pricing.faq }} />
    </div>
  );
}
