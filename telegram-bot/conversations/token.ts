import supabase from "../supabase.ts";
import { BotContext } from "../types.ts";
import { type Conversation } from "https://deno.land/x/grammy_conversations@v2.0.1/mod.ts";
import { Profile } from "../types.ts";

export default async function token(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
) {
  await ctx.reply(ctx.t("start"));
  let user: Profile | null = null;
  while (!user) {
    const { message } = await conversation.waitFor("message:text");
    const { from, text } = message;
    const { data, error } = await conversation.external(() =>
      supabase.from("profiles")
        .update({ telegram_id: from.id })
        .eq("telegram_token", text)
        .select(
          "id, first_name, telegram_id, settings(currency, language, timezone, telegram_notifications, email_notifications)",
        )
        .returns<Profile[]>()
        .single()
    );
    if (error) {
      if (error.code === "PGRST116" || error.code === "22P02") {
        await ctx.reply(ctx.t("global.invalid-token"));
      } else {
        await ctx.reply("global.errror");
      }
    } else {
      user = data;
    }
  }
  const { first_name } = user;
  await ctx.reply(
    ctx.t("start.welcome", { first_name }),
  );
  await conversation.external((ctx) => {
    ctx.session.user = user;
  });
}
