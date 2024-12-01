import getDictionary from "@/dict";
import { articles } from "@/dict/blog";
import ArticleRef from "./article";

export default async function OtherArticles({
  name,
  lang,
}: {
  name: string;
  lang: Lang;
}) {
  const { blog } = await getDictionary(lang);
  const posts = await Promise.all(
    Object.entries(articles)
      .filter(([k]) => k !== name)
      .map(([href, article]) =>
        article(lang).then((m) => ({
          ...(m as unknown as { attributes: Omit<ArticleAttributes, "href"> })
            .attributes,
          href,
        }))
      )
  );
  return (
    <div className="lg:grid grid-cols-3 gap-4 sm:gap-6 flex flex-col mt-12">
      {posts.map((article) => (
        <ArticleRef article={article} dict={blog.article} key={article.href} />
      ))}
    </div>
  );
}
