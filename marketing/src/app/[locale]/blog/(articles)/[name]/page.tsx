import metadata, { openGraph, twitter } from "@/app/shared-metadata";
import Breadcrumbs from "@/components/blog/breadcrumbs";
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
  const article = (await getArticle(name, lang)) as any;
  if (!article) notFound();
  const Content = article.default;

  return (
    <>
      <Breadcrumbs {...article.attributes} href={name} locale={locale} />
      <Content />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.monfuse.com/${locale}/blog/${name}`,
          },
          headline: article.attributes.title,
          description: article.attributes.description,
          author: {
            "@type": "Person",
            name: "Monfuse Team",
            url: `https://www.monfuse.com/${locale}`,
          },
          publisher: {
            "@type": "Organization",
            name: "Monfuse",
            logo: {
              "@type": "ImageObject",
              url: "https://www.monfuse.com/logo.png",
              width: 120,
              height: 120,
            },
          },
          datePublished: article.attributes.publishedDate,
          dateModified: article.attributes.publishedDate,
          image: `https://www.monfuse.com${article.attributes.image.src}`,
          articleSection: "Finance, Personal Budgeting, Apps",
          keywords: [
            "przychody",
            "wydatki",
            "cele finansowe",
            "zarządzanie budżetem",
            "Monfuse",
            "aplikacja finansowa",
            "płatności cykliczne",
          ],
          url: `https://www.monfuse.com/${locale}/blog/${name}`,
          about: {
            "@type": "Thing",
            name: "Financial Management",
          },
          inLanguage: lang,
          isPartOf: {
            "@type": "WebPage",
            hasPart: LOCALES.filter((lcl) => lcl !== locale).map((lcl) => ({
              "@type": "WebPage",
              "@id": `https://www.monfuse.com/${lcl}/blog/how-to-manage-incomes-with-monfuse`,
              inLanguage: getLang(lcl),
              url: `https://www.monfuse.com/${lcl}/blog/how-to-manage-incomes-with-monfuse`,
            })),
          },
          potentialAction: {
            "@type": "ReadAction",
            target: `https://www.monfuse.com/${locale}/blog/${name}`,
          },
        })}
      </script>
    </>
  );
}
