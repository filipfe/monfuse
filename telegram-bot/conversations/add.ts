import { Menu } from "grammy:menu";
import supabase from "../supabase.ts";
import { BotContext, Payment } from "../types.ts";
import {
  type Conversation,
} from "https://deno.land/x/grammy_conversations@v2.0.1/mod.ts";

export const typeMenu = new Menu<BotContext>("operation-type")
  .text(
    (ctx) => ctx.t("global.income"),
    (ctx) => ctx.conversation.enter("add", "income"),
  )
  .text(
    (ctx) => ctx.t("global.expense"),
    (ctx) => ctx.conversation.enter("add", "expense"),
  );

export default async function add(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext,
  type: Payment["type"],
) {
  const user = await conversation.external((ctx) => ctx.session.user);
  if (!user) return;

  await ctx.reply(
    ctx.t("add.title", { type: type === "income" ? "przychód" : "wydatek" }),
  );
  const title = await conversation.form.text();
  await ctx.reply(ctx.t("add.amount"));
  const amount = await conversation.form.number({
    otherwise: (ctx) => ctx.reply(ctx.t("add.invalid-amount")),
  });

  const { data, error } = await supabase.from(`${type}s`).insert({
    title,
    amount,
    currency: user.settings.currency,
    user_id: user.id,
  }).select("id");

  if (error) {
    await ctx.reply(ctx.t("error"));
  } else {
    await ctx.reply(
      ctx.t("add.success", {
        operations: `• ${
          type === "expense" ? ctx.t("global.expense") : ctx.t("global.income")
        }: ${title} - ${
          new Intl.NumberFormat(user.settings.language, {
            currency: user.settings.currency,
            style: "currency",
          }).format(amount)
        }`,
      }),
    );
    await conversation.external(
      (ctx) => (ctx.session.lastPayments = data.map((payment) => payment.id)),
    );
  }
}
