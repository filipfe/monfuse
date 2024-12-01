import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({
  title,
  locale,
  href,
  publishedDate,
}: ArticleAttributes & { locale: Locale }) {
  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-4 justify-between mb-2 sm:mb-4">
        <time className="text-font/80 text-sm" dateTime={publishedDate}>
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "long",
          }).format(new Date(publishedDate))}
        </time>
        <div className="flex items-center gap-1 max-sm:mb-4">
          <Link
            className="text-font/75 text-sm sm:px-1 sm:py-0.5 sm:hover:bg-light sm:border border-transparent sm:hover:border-border transition-colors rounded-md"
            href="/blog"
          >
            Blog
          </Link>
          <ChevronRight className="text-font/75" size={16} />
          <Link
            className="font-semibold line-clamp-1 text-sm sm:px-1 sm:py-0.5 sm:hover:bg-light sm:border border-transparent sm:hover:border-border transition-colors rounded-md"
            href={`/blog/${href}`}
          >
            {title}
          </Link>
        </div>
      </div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Blog",
              item: `https://www.monfuse.com/${locale}/blog`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: `https://www.monfuse.com/${locale}/blog/${href}`,
            },
          ],
        })}
      </script>
    </>
  );
}
