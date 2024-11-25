import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import getUser from "../utils/get-user.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";
import { Payment } from "../../_shared/types.ts";

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
      reply: "global.error",
    };
  }
}

export default async function add(ctx: CommandContext<BotContext>) {
  if (!ctx.from) {
    await ctx.reply(
      ctx.t("global.unauthorized"),
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    // await ctx.reply("Wybierz typ operacji:", { reply_markup: menu });
  } else {
    await ctx.reply("Zarejestruj się, aby kontynuować! Wpisz komendę /start");
  }
}
