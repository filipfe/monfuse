"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAccount(): Promise<
  SupabaseSingleRowResponse<Account>
> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, ...settings(language)")
    .single();

  if (authError) {
    return {
      result: null,
      error: authError.message,
    };
  }

  return {
    result: data,
  };
}

export async function updatePreferences(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const value = formData.get("value")?.toString() ?? "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("settings")
    .update({
      [name]: value,
    })
    .eq("user_id", user?.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
}

export async function updateName(
  formData: FormData,
): Promise<SupabaseResponse<any>> {
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
    })
    .eq("id", user?.id);

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  revalidatePath("/settings/account");

  return {
    results: [],
  };
}
