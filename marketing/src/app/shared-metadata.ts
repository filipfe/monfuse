import { langs } from "@/dict";
import { Metadata } from "next";

const metadata: Omit<Metadata, "openGraph"> = {
  metadataBase: new URL("https://www.monfuse.com"),
};

export const openGraph: Metadata["openGraph"] = {
  type: "website",
  emails: ["team@monfuse.com"],
  siteName: "Monfuse",
  alternateLocale: langs,
};

export default metadata;
