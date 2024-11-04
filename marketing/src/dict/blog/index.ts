import "server-only";

import telegramBotIntegration from "./telegram-bot-integration";
import expenses from "./expenses";

export const articles = {
  "telegram-bot-integration": (locale: Locale) =>
    telegramBotIntegration[locale](),
  "expenses": (locale: Locale) => expenses[locale](),
};

export default async function getArticle(
  name: string,
  locale: Locale,
) {
  return await articles[name as keyof typeof articles](locale);
}
