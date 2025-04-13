import { Bot, session } from "grammy";
import { I18n } from "grammy:i18n";
import { freeStorage } from "grammy:storage";
import supabase from "./supabase.ts";
import { ADD, UNDO } from "./commands/index.ts";
import undo from "./commands/undo.ts";
import processVoice from "./utils/process-voice.ts";
import { insertOperations } from "./commands/add.ts";
import { Payment } from "./types.ts";
import { BotContext } from "./types.ts";
import { SessionData } from "./types.ts";
import {
  conversations,
  createConversation,
} from "https://deno.land/x/grammy_conversations@v2.0.1/mod.ts";
import { token } from "./conversations/index.ts";
import add, { typeMenu } from "./conversations/add.ts";
import { Profile } from "./types.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    "Environment variables missing: TELEGRAM_BOT_TOKEN",
  );
}

const i18n = new I18n<BotContext>({
  defaultLocale: "en",
  localeNegotiator: async (ctx) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "settings(language)",
      )
      .eq("telegram_id", ctx.from?.id)
      .returns<Profile[]>()
      .single();
    console.log(data, error);
    if (error) {
      return ctx.from?.language_code ?? "en";
    }
    return data.settings.language;
  },
  useSession: false,
  directory: "locales",
});

const bot = new Bot<BotContext>(TELEGRAM_BOT_TOKEN);

bot.use(
  session({
    initial: () => ({ lastPayments: [], user: null } as SessionData),
    getSessionKey: (ctx) => ctx.from?.id.toString(),
    storage: freeStorage<SessionData>(bot.token),
  }),
);

bot.use(i18n);

bot.use(conversations({
  plugins: [
    i18n,
  ],
}));

bot.use(createConversation(token));
bot.use(createConversation(add));

bot.use(typeMenu);

bot.command("start", async (ctx) => {
  if (!ctx.session.user) {
    if (!ctx.from) {
      await ctx.reply(
        ctx.t("global.unauthorized"),
      );
    } else {
      await ctx.conversation.enter("token");
    }
  } else {
    const { first_name } = ctx.session.user;
    await ctx.reply(
      ctx.t("start.already-registered", {
        first_name,
      }),
    );
  }
});

Object.values(ADD).forEach((command) => {
  bot.command(
    command,
    (ctx) => ctx.reply(ctx.t("add.type"), { reply_markup: typeMenu }),
  );
});

Object.values(UNDO).forEach((command) => {
  bot.command(command, undo);
});

// Object.values(HELP).forEach((command) => {
//   bot.command(command, help);
// });

// Object.values(GRAPH).forEach((command) => {
//   bot.command(command, graph);
// });

// bot.on("message:text", async (ctx) => {
//   await ctx.replyWithChatAction("typing");
//   const user = await getUser(ctx.from.id);
//   if (!user) {
//     await registerUser(ctx);
//     return;
//   }
//   console.log({ user });
//   const { reply, operations, ids } = await processText(ctx.msg.text, user);
//   if (operations.length > 0) {
//     ctx.session.lastPayments = ids;
//   }
//   await ctx.reply(ctx.t(
//     reply,
//     reply === "add.success"
//       ? {
//         operations: operations
//           .map(
//             ({ title, amount, type, currency }) =>
//               `• ${
//                 type === "expense"
//                   ? ctx.t("global.expense")
//                   : ctx.t("global.income")
//               }: ${title} - ${
//                 new Intl.NumberFormat(user.settings.language, {
//                   currency,
//                   style: "currency",
//                 }).format(amount)
//               }`,
//           )
//           .join("\n"),
//       }
//       : undefined,
//   ));
// });

bot.on("message:photo", async (ctx) => {
  const { user } = ctx.session;
  if (user) {
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
      const { data, error } = await supabase.functions.invoke(
        "process-receipt",
        {
          body,
        },
      );

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
        reply === "add.success"
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
  } else {
    await ctx.reply(ctx.t("global.not-found"));
  }
});

bot.on("message:voice", async (ctx) => {
  const { user } = ctx.session;
  if (user) {
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
      reply === "add.success"
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
  } else {
    ctx.reply(
      ctx.t("global.not-found"),
    );
  }
});

Deno.addSignalListener("SIGINT", () => bot.stop());
Deno.addSignalListener("SIGTERM", () => bot.stop());

bot.start();
