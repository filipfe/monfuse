import { articles } from "@/dict/blog";
import { LOCALES } from "@/lib/locales";
import type { MetadataRoute } from "next";

const urls = [
  "",
  "/incomes",
  "/expenses",
  "/goals",
  "/recurring-payments",
  "/ai-assistant",
  "/pricing",
  "/privacy-policy",
  "/blog",
  ...Object.keys(articles).map((name) => "/blog/" + name),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return urls
    .flatMap((pathname) =>
      LOCALES.map((locale) => ({
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
      }))
    );
}
