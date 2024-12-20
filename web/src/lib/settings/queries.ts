"use client";

import { createClient } from "@/utils/supabase/client";

export async function getLanguages(): Promise<Language[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("languages")
    .select("code, name")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateSettings(key: string, value: any) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("settings")
    .update({ [key]: value })
    .eq("user_id", user?.id);

  const { data, error: selectError } = await supabase
    .from("profiles")
    .select(
      "telegram_token, telegram_id, ...settings(timezone, currency, language, insert_subscription_expense, subscription_expense_label), notifications:settings(telegram:telegram_notifications, email:email_notifications)",
    )
    .returns<Settings>()
    .single();

  if (error || selectError) {
    throw new Error(error ? error.message : selectError?.message);
  }

  return data;
}
