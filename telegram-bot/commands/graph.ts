import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext } from "../types.ts";

export default async function graph(ctx: CommandContext<BotContext>) {
  if (ctx.session.user) {
    const { user } = ctx.session;
    const date = ctx.msg.date * 1000;
    const { data, error } = await supabase.functions.invoke("weekly-graph", {
      body: {
        date,
        user,
      },
    });
    if (error) {
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
