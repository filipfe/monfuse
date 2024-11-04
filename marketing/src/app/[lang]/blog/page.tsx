import Article from "@/components/blog/article";
import { articles } from "@/dict/blog";
import { Metadata } from "next";
import _metadata, { openGraph, twitter } from "@/app/shared-metadata";
import { langs } from "@/dict";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    ..._metadata,
    title: "Blog, Learn How To Manage Your Finances Effectively | Monfuse",
    description:
      "Discover tips and practical advice on managing your finances effectively. The Monfuse Blog covers budgeting, expense tracking, financial goal setting, and more to help you achieve financial wellness.",
    openGraph: {
      ...openGraph,
      url: new URL(`https://www.monfuse.com/${lang}`),
      locale: lang,
      title: "Blog, Learn How To Manage Your Finances Effectively | Monfuse",
      description:
        "Discover tips and practical advice on managing your finances effectively. The Monfuse Blog covers budgeting, expense tracking, financial goal setting, and more to help you achieve financial wellness.",
      type: "article",
    },
    twitter: {
      ...twitter,
      title: "Blog, Learn How To Manage Your Finances Effectively | Monfuse",
      description:
        "Discover tips and practical advice on managing your finances effectively. The Monfuse Blog covers budgeting, expense tracking, financial goal setting, and more to help you achieve financial wellness.",
    },
    alternates: {
      canonical: new URL(`https://www.monfuse.com/${lang}/blog`),
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}/blog`,
        }),
        {}
      ),
    },
  };
}

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
    <section className="py-6 sm:py-16 px-6">
      <div className="mx-auto max-w-7xl w-full">
        <div>
          <h1 className="text-center text-3xl font-black sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
            Blog
          </h1>
          <p className="text-sm sm:text-base text-font/75 text-center leading-relaxed sm:leading-relaxed max-w-64 sm:max-w-xs lg:max-w-none mx-auto w-full">
            Learn how to manage your finances effectively with Monfuse
          </p>
        </div>
        <div className="lg:grid grid-cols-3 gap-4 sm:gap-6 flex flex-col mt-12">
          {data.map((article) => (
            <Article {...article} key={article.href} />
          ))}
        </div>
      </div>
    </section>
  );
}
