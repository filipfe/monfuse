import { Menu } from "grammy:menu";
import { BotContext } from "./types.ts";

const menu = new Menu<BotContext>("operations-menu")
  .text((ctx) => ctx.t("global.income"), async (ctx) => {
    await ctx.reply(
      "",
    );
  })
  .text((ctx) => ctx.t("global.expense"), async (ctx) => {
    await ctx.reply(
      "",
    );
  });

export default menu;
