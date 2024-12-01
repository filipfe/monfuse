import OtherArticles from "@/components/blog/other-articles";
import ToC from "@/components/blog/toc";
import getDictionary from "@/dict";
import getArticle from "@/dict/blog";
import { getLang } from "@/lib/utils";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale; name: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale, name } = await params;
  const lang = getLang(locale);
  const article = (await getArticle(name, lang)) as any;
  if (!article) notFound();
  const { blog } = await getDictionary(lang);
  return (
    <div className="px-6">
      <div className="flex items-start justify-center lg:justify-end lg:gap-8 max-w-7xl w-full mx-auto pt-4 lg:pt-12 pb-8 lg:pb-24">
        <section className="max-w-3xl flex flex-col gap-2 sm:gap-4">
          {children}
        </section>
        <ToC name={name} lang={lang} dict={blog.toc} />
      </div>
      <section className="max-w-7xl mx-auto w-full">
        <h3 className="text-lg sm:text-xl lg:text-2xl lg:leading-tight leading-snug text-foreground font-bold">
          Sprawdź również inne artykuły Monfuse
        </h3>
        <OtherArticles article={article.attributes} lang={lang} dict={blog} />
      </section>
    </div>
  );
}
