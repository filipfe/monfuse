import { articles } from "@/dict/blog";
import { Metadata } from "next";
import _metadata, { openGraph, twitter } from "@/app/shared-metadata";
import getDictionary from "@/dict";
import ArticleRef from "@/components/blog/article";
import { LOCALES } from "@/lib/locales";
import { getLang } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLang(locale);
  const {
    blog: {
      _metadata: { title, description },
    },
  } = await getDictionary(lang);
  return {
    ..._metadata,
    title,
    description,
    openGraph: {
      ...openGraph,
      url: new URL(`https://www.monfuse.com/${locale}`),
      locale: locale.replace("-", "_"),
      title,
      description,
    },
    twitter: {
      ...twitter,
      title,
      description,
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${locale}/blog`),
      languages: LOCALES.reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: `https://www.monfuse.com/${locale}/blog`,
        }),
        {}
      ),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLang(locale);
  const { blog } = await getDictionary(lang);
  const posts = await Promise.all(
    Object.entries(articles).map(([href, article]) =>
      article(lang).then((m) => ({
        ...(m as unknown as { attributes: Omit<ArticleAttributes, "href"> })
          .attributes,
        href,
      }))
    )
  );
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.monfuse.com/${locale}/blog`,
          },
          name: "Monfuse Blog",
          description: blog._metadata.description,
          url: `https://www.monfuse.com/${locale}/blog`,
          publisher: {
            "@type": "Organization",
            name: "Monfuse",
            url: `https://www.monfuse.com/${locale}`,
            logo: {
              "@type": "ImageObject",
              url: "https://www.monfuse.com/logo.png",
              width: 120,
              height: 120,
            },
          },
          blogPost: posts.map((article) => ({
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            url: `https://www.monfuse.com/${locale}/blog/${article.href}`,
            datePublished: article.publishedDate,
            author: {
              "@type": "Person",
              name: "Monfuse Team",
            },
          })),
          inLanguage: lang,
        })}
      </script>
      <section className="py-6 sm:py-16 sm:px-6">
        <div className="mx-auto max-w-7xl w-full">
          <div className="max-sm:px-6">
            <h1 className="text-center text-3xl font-black sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
              {blog.title}
            </h1>
            <p className="text-sm sm:text-base text-font/75 text-center leading-relaxed sm:leading-relaxed max-w-64 sm:max-w-xs lg:max-w-none mx-auto w-full">
              {blog.description}
            </p>
          </div>
          <div className="lg:grid grid-cols-3 gap-4 sm:gap-6 flex flex-col mt-12">
            {posts.map((article) => (
              <ArticleRef
                article={article}
                dict={blog.article}
                key={article.href}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
