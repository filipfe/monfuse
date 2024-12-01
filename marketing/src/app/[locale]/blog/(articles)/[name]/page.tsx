import metadata, { openGraph, twitter } from "@/app/shared-metadata";
import getArticle, { articles } from "@/dict/blog";
import { LOCALES } from "@/lib/locales";
import { getLang } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ name: string; locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name, locale } = await params;
  const lang = getLang(locale);
  const article = (await getArticle(name, lang)) as any;
  if (!article) notFound();
  const { attributes } = article;
  const title = `${attributes.title} | Blog | Monfuse`;
  const { description, publishedDate } = attributes;
  return {
    ...metadata,
    title,
    description,
    openGraph: {
      ...openGraph,
      url: new URL(`https://www.monfuse.com/${locale}/blog/${name}`),
      title,
      description,
      locale: locale.replace("-", "_"),
      type: "article",
      images: [{ url: attributes.image.src, alt: attributes.image.alt }],
      publishedTime: new Date(publishedDate).toISOString(),
    },
    twitter: {
      ...twitter,
      title,
      description,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/blog/${name}`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/blog/${name}`,
        }),
        {}
      ),
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(articles).map((name) => ({ name }));
}

export default async function Page({ params }: PageProps) {
  const { name, locale } = await params;
  const lang = getLang(locale);
  const article = await getArticle(name, lang);
  if (!article) notFound();
  const Content = article.default;
  return <Content />;
}
