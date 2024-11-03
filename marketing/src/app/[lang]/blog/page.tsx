import Article from "@/components/blog/article";
import { articles } from "@/dict/blog";
import { Metadata } from "next";

export const metadata: Metadata = {};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const data = await Promise.all(
    Object.entries(articles).map(([href, article]) =>
      article(lang).then((m) => ({ ...m.attributes, href }))
    )
  );
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl w-full lg:grid grid-cols-3 gap-4 sm:gap-6 flex flex-col">
        {data.map((article) => (
          <Article {...article} key={article.href} />
        ))}
      </div>
    </section>
  );
}
