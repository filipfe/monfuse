import en from "./en.ts";
import es from "./es.ts";
import pl from "./pl.ts";

const locales = {
  en,
  es,
  pl,
};

const getLocale = (locale: keyof typeof locales) => locales[locale];

export type Dict = ReturnType<typeof getLocale>;

export default locales;
