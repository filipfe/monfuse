// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts";
import bot from "../_shared/telegram-bot.ts";
import { createClient } from "supabase";
import {} from "npm:date-fns";
import { toZonedTime } from "npm:date-fns-tz";
import dict from "./dict.ts";
import { Locale, Profile } from "../_shared/types.ts";

type Body = {
  message?: string;
  options?: {
    graph?: "daily" | "weekly" | "monthly";
  };
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const NOTIFICATION_SECRET = Deno.env.get("NOTIFICATION_SECRET");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !NOTIFICATION_SECRET) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        NOTIFICATION_SECRET,
      })
        .filter(([_key, value]) => !value)
        .map(([key]) => key)
        .join(", ")
    }`,
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const sendNotification = async (user: Profile, { message, options }: Body) => {
  const { telegram_notifications, email_notifications } = user.settings;
  if (email_notifications) {
    // send email
  }

  if (options?.graph) {
    const { data: graph } = await supabase.functions.invoke("weekly-graph", {
      body: { user },
    });
    if (!user.telegram_id || !telegram_notifications) return;
    await bot.api.sendPhoto(user.telegram_id, graph, {
      caption: dict[user.settings.language as Locale].graph.replace(
        "${first_name}",
        user.first_name,
      ),
    });
  } else {
    if (!user.telegram_id || !telegram_notifications || !message) return;
    await bot.api.sendMessage(user.telegram_id, message);
  }
};

Deno.serve(async (req) => {
  const secretKey = req.headers.get("x-secret-key");
  if (secretKey !== NOTIFICATION_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = (await req.json()) as Body;

  const { data: users, error } = await supabase
    .from("profiles")
    .select(
      "id, first_name, telegram_id, settings!inner(telegram_notifications, email_notifications, currency, language, timezone)",
    )
    .or("telegram_notifications.eq.true, email_notifications.eq.true", {
      foreignTable: "settings",
    })
    .returns<Profile[]>();

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  await Promise.all(
    (body.options?.graph
      ? users.filter(({ settings: { timezone } }) => {
        const datetime = toZonedTime(new Date(), timezone);
        return datetime.getHours() === 8 && datetime.getDay() === 1;
      })
      : users).map((user) => sendNotification(user, body)),
  );

  return new Response("ok", { status: 200 });
});
