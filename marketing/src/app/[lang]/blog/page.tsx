import Article from "@/components/blog/article";
import { articles } from "@/dict/blog";
import { Metadata } from "next";
import _metadata, { openGraph } from "@/app/shared-metadata";

export const metadata: Metadata = {
  ..._metadata,
  openGraph: {
    ...openGraph,
    type: "article",
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const data = await Promise.all(
    Object.entries(articles).map(([href, article]) =>
      article(lang).then((m) => ({
        ...(m as unknown as { attributes: Omit<ArticleAttributes, "href"> })
          .attributes,
        href,
      }))
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
