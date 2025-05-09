"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, telegram_token, telegram_id, first_name, last_name, has_used_trial, ...settings(timezone, currency, language)",
    )
    .returns<Settings[]>()
    .single();

  if (error) {
    revalidatePath("/", "layout");
    throw new Error(error.message);
  }

  return data;
}

export async function updateRow(
  id: string,
  type: OperationType,
  fields: { [key: string]: any },
) {
  const supabase = await createClient();
  const { error } = await supabase.from(`${type}s`).update(fields).eq("id", id);

  if (error) {
    return {
      error,
      results: [],
    };
  }

  revalidatePath(`/${type}s`);

  return {
    results: [],
  };
}

export async function deleteRows<T>(
  data: "all" | string[],
  type: string,
): Promise<Pick<SupabaseResponse, "error">> {
  const supabase = await createClient();

  let query = supabase.from(`${type}s`).delete();

  if (data === "all") {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return {
        error: "Błąd autoryzacji, spróbuj zalogować się ponownie!",
      };
    }

    query = query.eq("user_id", user.id);
  } else {
    query = query.in("id", data);
  }

  const { error } = await query;

  if (error) {
    console.error("Couldn't delete rows: ", error);
    return {
      error: error.message,
    };
  }

  revalidatePath(`/${type}s`);

  return {};
}
