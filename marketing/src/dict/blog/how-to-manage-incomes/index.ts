import "server-only";

const howToManageIncomes = {
  pl: () => import("./pl.mdx").then((module) => module),
  en: () => import("./en.mdx").then((module) => module),
};

// const getArticle = async (locale: Locale) => articles[locale]();

export default howToManageIncomes;
