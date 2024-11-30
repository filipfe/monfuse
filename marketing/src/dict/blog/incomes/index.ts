import "server-only";

const appIncomes = {
  pl: () => import("./pl.mdx").then((module) => module),
  en: () => import("./en.mdx").then((module) => module),
};

// const getArticle = async (locale: Locale) => articles[locale]();

export default appIncomes;
