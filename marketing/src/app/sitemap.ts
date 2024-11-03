import { langs } from "@/dict";
import { articles } from "@/dict/blog";
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
  // "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...urls, Object.keys(articles).map((url) => "/blog/" + url)].map((
    url,
  ) => ({
    url: `https://www.monfuse.com${url}`,
    changeFrequency: "yearly",
    priority: 1,
    lastModified: new Date(),
    alternates: {
      languages: langs.reduce(
        (prev, lang) => ({
          ...prev,
          [lang]: `https://www.monfuse.com/${lang}${url}`,
        }),
        {},
      ),
    },
  }));
}
