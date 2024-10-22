import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/ui/header/content";
import Footer from "@/components/ui/footer";
import Banner from "@/components/ui/banner";
import getDictionary, { langs } from "@/dict";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params: { lang },
}: PageProps): Promise<Metadata> {
  const { _metadata } = await getDictionary(lang);
  return {
    ..._metadata,
    metadataBase: new URL("https://www.monfuse.com"),
    openGraph: {
      title: _metadata.title,
      description: _metadata.description,
      type: "website",
      url: new URL("https://www.monfuse.com"),
      emails: ["team@monfuse.com"],
      siteName: "Monfuse",
      locale: lang,
      alternateLocale: langs,
    },
    twitter: {
      title: _metadata.title,
      description: _metadata.description,
      card: "summary_large_image",
    },
    alternates: {
      canonical: "./",
    },
  };
}

export async function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<
  {
    children: React.ReactNode;
  } & PageProps
>) {
  const dict = await getDictionary(params.lang);
  const { banner } = dict;
  return (
    <html lang={params.lang} className="light">
      <body className={inter.className}>
        <Header dict={dict} />
        <main>{children}</main>
        <Banner dict={banner} />
        <Footer dict={dict} />
      </body>
    </html>
  );
}
