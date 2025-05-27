import { LOCALES } from "@/lib/locales";
import { Metadata } from "next";

const GOOGLE_VERIFICATION_KEY = process.env.GOOGLE_VERIFICATION_KEY;

  if (!GOOGLE_VERIFICATION_KEY) {
    throw new Error("Environment variables missing: GOOGLE_VERIFICATION_KEY");
  }

const metadata: Omit<Metadata, "openGraph"> = {
  metadataBase: new URL("https://www.monfuse.com"),
  verification: {
    google: GOOGLE_VERIFICATION_KEY,
  }
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
