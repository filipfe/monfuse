import "server-only";

const dictionaries = {
  pl: () => import("./pl.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

const getDictionary = async (lang: Lang) => dictionaries[lang]();

export type Dict = Awaited<ReturnType<typeof getDictionary>>;

export default getDictionary;
