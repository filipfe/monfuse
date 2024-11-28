import "server-only";

import telegramBotIntegration from "./telegram-bot-integration";
import expenses from "./expenses";

export const articles = {
  "telegram-bot-integration": (lang: Lang) => telegramBotIntegration[lang](),
  // "expenses": (lang: Lang) => expenses[lang](),
};

export default async function getArticle(
  name: string,
  lang: Lang,
) {
  return await articles[name as keyof typeof articles](lang);
}
