type Locale = "pl" | "en";

type PageProps = {
  params: Promise<{
    lang: Locale;
  }>;
};
