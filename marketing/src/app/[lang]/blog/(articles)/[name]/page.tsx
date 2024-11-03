import getArticle, { articles } from "@/dict/blog";

export async function generateStaticParams() {
  return Object.keys(articles).map((name) => ({ name }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; lang: Locale }>;
}) {
  const { name, lang } = await params;
  const article = await getArticle(name, lang);
  const Content = article.default;
  return <Content />;
}
