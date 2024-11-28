import { LOCALES } from "@/lib/locales";
import { Metadata } from "next";

const metadata: Omit<Metadata, "openGraph"> = {
  metadataBase: new URL("https://www.monfuse.com"),
};

export const openGraph: Metadata["openGraph"] = {
  type: "website",
  siteName: "Monfuse",
  alternateLocale: LOCALES.map((locale) => locale.replace("-", "_")),
};

export const twitter: Metadata["twitter"] = {
  card: "summary_large_image",
};

export default metadata;
