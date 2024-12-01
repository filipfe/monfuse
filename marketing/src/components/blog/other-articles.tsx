import getDictionary, { Dict } from "@/dict";
import getArticle, { articles } from "@/dict/blog";
import ArticleRef from "./article";

type Props = {
  article: ArticleAttributes;
  dict: Dict["blog"];
  lang: Lang;
};

export default async function OtherArticles({ article, lang, dict }: Props) {
  const posts = await Promise.all(
    Object.entries(articles)
      .filter(([k]) => article.similar.includes(k))
      .map(([href, article]) =>
        article(lang).then((m) => ({
          ...(m as unknown as { attributes: Omit<ArticleAttributes, "href"> })
            .attributes,
          href,
        }))
      )
  );
  return (
    <div className="lg:grid grid-cols-3 gap-4 sm:gap-6 flex flex-col mt-6">
      {posts.map((article) => (
        <ArticleRef article={article} dict={dict.article} key={article.href} />
      ))}
    </div>
  );
}
