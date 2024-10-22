import { langs } from "@/dict";
import type { MetadataRoute } from "next";

const urls = [
  "",
  "/services/incomes",
  "/services/expenses",
  "/services/incomes",
  "/services/recurring-payments",
  "/services/goals",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return urls.map((url) => ({
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
