import "server-only";

import telegramBotIntegration from "./telegram-bot-integration";
import appIncomes from "./incomes";

export const articles = {
  incomes: (lang: Lang) => appIncomes[lang](),
  "telegram-bot-integration": (lang: Lang) => telegramBotIntegration[lang](),
};

export default async function getArticle(
  name: string,
  lang: Lang,
) {
  if (!articles[name as keyof typeof articles]) return null;
  return await articles[name as keyof typeof articles](lang);
}
