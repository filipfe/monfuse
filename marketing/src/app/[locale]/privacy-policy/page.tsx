import getDictionary from "@/dict";
import { getLang } from "@/lib/utils";
import Markdown from "react-markdown";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLang(locale);
  const dict = await getDictionary(lang);
  return (
    <section className="py-12 sm:py-16 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <Markdown
          components={{
            h1: ({ children, ...props }) => (
              <h1
                className="text-2xl sm:text-3xl font-bold mb-2 mt-6"
                {...props}
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2
                className="text-xl sm:text-2xl font-semibold mb-2 mt-6"
                {...props}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                className="text-lg sm:text-xl font-semibold mb-2 mt-6"
                {...props}
              >
                {children}
              </h3>
            ),
          }}
        >
          {dict["privacy-policy"].content}
        </Markdown>
      </div>
    </section>
  );
}
