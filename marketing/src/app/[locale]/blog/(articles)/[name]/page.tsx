import getArticle, { articles } from "@/dict/blog";
import { getLang } from "@/lib/utils";

export async function generateStaticParams() {
  return Object.keys(articles).map((name) => ({ name }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; locale: Locale }>;
}) {
  const { name, locale } = await params;
  const lang = getLang(locale);
  const article = await getArticle(name, lang);
  const Content = article.default;
  return <Content />;
}
