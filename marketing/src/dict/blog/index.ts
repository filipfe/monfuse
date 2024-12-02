import "server-only";

import telegramBotIntegration from "./telegram-bot-integration";
import howToManageIncomes from "./how-to-manage-incomes";
import howToManageRecurringPayments from "./how-to-manage-recurring-payments";

export const articles = {
  "how-to-manage-recurring-payments": (lang: Lang) =>
    howToManageRecurringPayments[lang](),
  "how-to-manage-incomes": (lang: Lang) => howToManageIncomes[lang](),
  "telegram-bot-integration": (lang: Lang) => telegramBotIntegration[lang](),
};

export default async function getArticle(
  name: string,
  lang: Lang,
) {
  if (!articles[name as keyof typeof articles]) return null;
  return await articles[name as keyof typeof articles](lang);
}
