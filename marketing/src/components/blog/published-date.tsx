"use client";

import { useParams } from "next/navigation";

export default function PublishedDate({
  publishedDate,
}: Pick<ArticleAttributes, "publishedDate">) {
  const { locale } = useParams();
  return (
    <time className="text-font/75 text-sm" dateTime={publishedDate}>
      {new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
      }).format(new Date(publishedDate))}
    </time>
  );
}
