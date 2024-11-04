import "server-only";

const expenses = {
  pl: () => import("./pl.mdx").then((module) => module),
  en: () => import("./en.mdx").then((module) => module),
};

export default expenses;
