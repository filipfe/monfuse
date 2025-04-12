import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext, Payment } from "../types.ts";

export default async function undo(ctx: CommandContext<BotContext>) {
  const lastPayments = ctx.session.lastPayments;

  console.log("Last payments: ", lastPayments);

  if (lastPayments.length === 0) {
    await ctx.reply(
      ctx.t("error.undo-not-found"),
    );
    return;
  }

  const { data, error } = await supabase.rpc("actions_delete_operations", {
    p_ids: lastPayments,
  }).returns<Payment[]>();

  if (error || !data) {
    console.error("Couldn't delete operations: ", error);
    await ctx.reply(
      ctx.t("error"),
    );
  } else {
    await ctx.reply(ctx.t("undo.success", {
      operations: data
        .map(
          ({ title, amount, type, currency }) =>
            `• ${type === "expense" ? "Wydatek" : "Przychód"}: ${title} - ${
              new Intl.NumberFormat("pl-PL", {
                currency,
                style: "currency",
              }).format(amount)
            }`,
        )
        .join("\n"),
    }));
    ctx.session.lastPayments = [];
  }
}
