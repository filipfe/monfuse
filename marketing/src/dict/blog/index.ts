import "server-only";

import telegramBotIntegration from "./telegram-bot-integration";

export const articles = {
  "telegram-bot-integration": (locale: Locale) =>
    telegramBotIntegration[locale](),
};

export default async function getArticle(
  name: string,
  locale: Locale,
) {
  return await articles[name as keyof typeof articles](locale);
}
