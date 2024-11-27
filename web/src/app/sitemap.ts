import { LOCALES } from "@/const/locales";
import type { MetadataRoute } from "next";

const urls = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    urls.map(
      (pathname) => ({
        url: `https://app.monfuse.com/${locale}${pathname}`,
        changeFrequency: "yearly",
        priority: 1,
        lastModified: new Date(),
        alternates: {
          languages: LOCALES.reduce(
            (prev, lcl) => ({
              ...prev,
              [lcl]: `https://app.monfuse.com/${lcl}${pathname}`,
            }),
            {},
          ),
        },
      }),
    )
  );
  // return urls.map((
  //   url,
  // ) => ({
  //   url: `https://app.monfuse.com${url}`,
  //   changeFrequency: "yearly",
  //   priority: 1,
  //   lastModified: new Date(),
  //   alternates: {
  //     languages: LOCALES.reduce(
  //       (prev, locale) => ({
  //         ...prev,
  //         [locale]: `https://app.monfuse.com/${locale}${url}`,
  //       }),
  //       {},
  //     ),
  //   },
  // }));
}
