import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext, Payment } from "../types.ts";
import menu from "../menu.ts";

export async function insertOperations(
  operations: Payment[],
  user: Profile,
): Promise<Omit<ProcessReturn, "operations">> {
  const { data: ids, error } = await supabase.rpc("actions_insert_operations", {
    p_operations: operations.map((op) => ({ ...op, from_telegram: true })),
    p_user_id: user.id,
  });
  if (!error) {
    console.log("Inserted operations: ", ids);
    return {
      reply: "text.success",
      ids,
    };
  } else {
    console.error(error);
    return {
      ids: [],
      reply: "error",
    };
  }
}

export default async function add(ctx: CommandContext<BotContext>) {
  if (ctx.session.user) {
    await ctx.reply(ctx.t("add.type"), { reply_markup: menu });
  } else {
    await ctx.reply(ctx.t("gl"));
  }
}
