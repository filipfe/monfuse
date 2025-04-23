"use client";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getLanguages(): Promise<Language[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("code, name")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getSettings() {
  const { data } = await supabase
    .from("profiles")
    .select(
      "telegram_token, telegram_id, ...settings(timezone, currency, language, insert_subscription_expense, subscription_expense_label), notifications:settings(telegram:telegram_notifications, email:email_notifications)",
    )
    .returns<Settings>()
    .single().throwOnError();

  return data;
}

export async function updateSettings(key: string, value: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("settings")
    .update({ [key]: value })
    .eq("user_id", user?.id)
    .throwOnError();

  const settings = await getSettings();

  return settings;
}
