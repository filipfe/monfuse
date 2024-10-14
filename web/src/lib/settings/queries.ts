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

export async function getAccount(): Promise<Account> {
  const supabase = createClient();

  const { data, error: authError } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, language_code")
    .single();

  if (authError) {
    throw new Error(authError.message);
  }

  return data;
}

export async function updateAccount(account: Partial<Account>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update(account)
    .eq("id", user?.id);

  if (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return {};
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
    .select("telegram_id, ...settings(*)")
    .single();
  if (error || selectError) {
    throw new Error(error ? error.message : selectError?.message);
  }

  return data;
}
