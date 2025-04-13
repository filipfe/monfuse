import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import getUser from "../utils/get-user.ts";
import { BotContext } from "../types.ts";

export default async function graph(ctx: CommandContext<BotContext>) {
  if (!ctx.from) {
    await ctx.reply(
      ctx.t("global.unauthorized"),
    );
    return;
  }
  await ctx.replyWithChatAction("typing");
  const user = await getUser(ctx.from.id);
  if (user) {
    const date = ctx.msg.date * 1000;
    const { data, error } = await supabase.functions.invoke("weekly-graph", {
      body: {
        date,
        user,
      },
    });
    if (error) {
      console.error(error);
      await ctx.reply(ctx.t("error"));
    } else {
      await ctx.replyWithPhoto(data, {
        caption: ctx.t("graph.weekly"),
      });
    }
  } else {
    await ctx.reply(ctx.t("global.not-found"));
  }
}
