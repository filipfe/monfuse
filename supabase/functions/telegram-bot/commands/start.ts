import supabase from "../supabase.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";

export default async function registerUser(
  ctx: BotContext,
) {
  const { from, text: telegramToken } = ctx.msg!;
  const { data, error } = await supabase.from("profiles").update(
    { telegram_id: from!.id },
  ).eq(
    "telegram_token",
    telegramToken,
  ).select("first_name").single();
  if (error || !data) {
    if (error.code === "PGRST116" || error.code === "22P02") {
      await ctx.reply(ctx.t("global.invalid-token"));
    } else {
      await ctx.reply("global.errror");
      return;
    }
    return;
  }
  await ctx.reply(
    ctx.t("start.welcome", { first_name: data?.first_name || "" }),
  );
}
