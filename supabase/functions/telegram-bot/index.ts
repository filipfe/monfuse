import { webhookCallback } from "grammy";
import undo from "./commands/undo.ts";
import { insertOperations } from "./commands/add.ts";
import getUser from "./utils/get-user.ts";
import supabase from "./supabase.ts";
import { UNDO } from "./commands.ts";
import bot from "../_shared/telegram-bot.ts";
import registerUser from "./commands/start.ts";
import processVoice from "./utils/process-voice.ts";
import processText from "./utils/process-text.ts";
import { Payment } from "../_shared/types.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

bot.command("start", async (ctx) => {
  // console.log({ source: toFluentFormat(pl) });
  if (!ctx.from) {
    await ctx.reply(
      ctx.t("global.unauthorized"),
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    await ctx.reply(
      ctx.t("start.already-registered", {
        first_name: user.first_name,
      }),
    );
  } else {
    await ctx.reply(
      ctx.t("start"),
    );
  }
});

// Object.values(ADD).forEach((command) => {
//   bot.command(command, add);
// });

Object.values(UNDO).forEach((command) => {
  bot.command(command, undo);
});

// Object.values(HELP).forEach((command) => {
//   bot.command(command, help);
// });

// Object.values(GRAPH).forEach((command) => {
//   bot.command(command, graph);
// });

bot.on("message:text", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  const user = await getUser(ctx.from.id);
  if (!user) {
    await registerUser(ctx);
    return;
  }
  console.log({ user });
  const { reply, operations, ids } = await processText(ctx.msg.text, user);
  if (operations.length > 0) {
    ctx.session.lastPayments = ids;
  }
  await ctx.reply(ctx.t(
    reply,
    reply === "text.success"
      ? {
        operations: operations
          .map(
            ({ title, amount, type, currency }) =>
              `• ${
                type === "expense"
                  ? ctx.t("global.expense")
                  : ctx.t("global.income")
              }: ${title} - ${
                new Intl.NumberFormat(user.settings.language, {
                  currency,
                  style: "currency",
                }).format(amount)
              }`,
          )
          .join("\n"),
      }
      : undefined,
  ));
});

bot.on("message:photo", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  const user = await getUser(ctx.from.id);

  if (!user) {
    return await ctx.reply(ctx.t("global.not-found"));
  }

  console.log({ user });

  const { file_path } = await ctx.getFile();

  if (!file_path) {
    ctx.reply(
      ctx.t("error.photo-download"),
    );
    return;
  }

  const split = file_path.split("/");
  const filename = split[split.length - 1];
  const format = filename.split(".").pop();

  const blob = await fetch(
    `https://api.telegram.org/file/bot${bot.token}/${file_path}`,
  ).then((res) => res.blob());

  const file = new Blob([blob], {
    type: `image/${format === "jpg" ? "jpeg" : format}`,
  });

  const body = new FormData();
  body.append("user_id", user.id);
  body.append(crypto.randomUUID(), file);

  console.log({ body });

  try {
    const { data, error } = await supabase.functions.invoke("process-receipt", {
      body,
    });

    if (error) {
      await ctx.reply(
        ctx.t("error"),
      );
      console.error(error);
      return;
    }

    const operations = data.operations as Payment[];

    const { reply, ids } = await insertOperations(
      operations,
      user,
    );
    if (ids.length > 0) {
      ctx.session.lastPayments = ids;
    }
    await ctx.reply(ctx.t(
      reply,
      reply === "text.success"
        ? {
          operations: operations
            .map(
              ({ title, amount, type, currency }) =>
                `• ${
                  type === "expense"
                    ? ctx.t("global.expense")
                    : ctx.t("global.income")
                }: ${title} - ${
                  new Intl.NumberFormat(user.settings.language, {
                    currency,
                    style: "currency",
                  }).format(amount)
                }`,
            )
            .join("\n"),
        }
        : undefined,
    ));
  } catch (err) {
    console.error("Caught an error: ", err);
    await ctx.reply(
      ctx.t("error"),
    );
  }
});

bot.on("message:voice", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  const user = await getUser(ctx.from.id);

  if (!user) {
    ctx.reply(
      ctx.t("global.not-found"),
    );
    return;
  }

  const { file_path } = await ctx.getFile();

  const { reply, operations, ids } = await processVoice(
    ctx.msg.voice,
    user,
    file_path,
  );
  if (operations.length > 0) {
    ctx.session.lastPayments = ids;
  }
  await ctx.reply(ctx.t(
    reply,
    reply === "text.success"
      ? {
        operations: operations
          .map(
            ({ title, amount, type, currency }) =>
              `• ${
                type === "expense"
                  ? ctx.t("global.expense")
                  : ctx.t("global.income")
              }: ${title} - ${
                new Intl.NumberFormat(user.settings.language, {
                  currency,
                  style: "currency",
                }).format(amount)
              }`,
          )
          .join("\n"),
      }
      : undefined,
  ));
});

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  console.log("headers", req.headers);
  try {
    const url = new URL(req.url);
    if (
      url.searchParams.get("secret") !== Deno.env.get("TELEGRAM_BOT_SECRET")
    ) {
      return new Response("Auth error: Secret is not valid", {
        status: 405,
      });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
  return new Response();
});
