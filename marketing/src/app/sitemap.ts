import { articles } from "@/dict/blog";
import { LOCALES } from "@/lib/locales";
import type { MetadataRoute } from "next";

const urls = [
  "",
  "/incomes",
  "/expenses",
  "/incomes",
  "/recurring-payments",
  "/goals",
  "/ai-assistant",
  "/blog",
  "/privacy-policy",
  // "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    [...urls, ...Object.keys(articles).map((url) => "/blog/" + url)].map(
      (pathname) => ({
        url: `https://www.monfuse.com/${locale}${pathname}`,
        changeFrequency: "yearly",
        priority: 1,
        lastModified: new Date(),
        alternates: {
          languages: LOCALES.reduce(
            (prev, lcl) => ({
              ...prev,
              [lcl]: `https://www.monfuse.com/${lcl}${pathname}`,
            }),
            {},
          ),
        },
      }),
    )
  );
}
