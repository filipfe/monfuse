type Lang = "pl" | "en";

type Locale = `${Lang}-${string}`;

type PageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};
