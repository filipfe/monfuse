import "server-only";

const howToManageRecurringPayments = {
  pl: () => import("./pl.mdx").then((module) => module),
  en: () => import("./en.mdx").then((module) => module),
};

export default howToManageRecurringPayments;
