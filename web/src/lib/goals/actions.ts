"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPriorityGoal(
  limit?: number,
): Promise<SupabaseSingleRowResponse<PriorityGoal>> {
  const supabase = await createClient();

  const { data: result, error } = await supabase.rpc(
    "get_goals_priority_goal",
    {
      p_limit: limit,
    },
  );

  if (error) {
    return {
      result: null,
      error: error.message,
    };
  }

  return {
    result,
  };
}

export async function getCurrentGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = await createClient();

  const { data: results, error } = await supabase.rpc("get_goals_current");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getGoalsPayments(
  timezone: string,
): Promise<SupabaseResponse<GoalPayment>> {
  const supabase = await createClient();
  const { data: results, error } = await supabase.rpc("get_goals_payments", {
    p_timezone: timezone,
    p_page: 1,
  });

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function addGoal(
  formData: FormData,
): Promise<Pick<SupabaseResponse, "error">> {
  const data = JSON.parse(formData.get("data")!.toString());
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return {
      error: "Błąd autoryzacji, spróbuj zalogować się ponownie!",
    };
  }
  const { error } = await supabase
    .from("goals")
    .insert({ ...data, user_id: user.id });

  if (error) {
    console.error("Couldn't add goals: ", error);
    return {
      error: error.message,
    };
  }

  revalidatePath("/goals");
  redirect("/goals");
}

export async function addGoalPayment(
  formData: FormData,
): Promise<Pick<SupabaseResponse, "error">> {
  const amount = formData.get("amount")?.toString();
  const goal_id = formData.get("goal_id")?.toString();
  const date = new Date().toDateString();
  const supabase = await createClient();

  const { error } = await supabase
    .from("goals_payments")
    .upsert({ date, goal_id, amount });

  if (error) {
    console.error("Couldn't add goal payment: ", error);
    return {
      error: error.message,
    };
  }

  revalidatePath("/goals");

  return {};
}

export async function updateAsPriority(id: string) {
  const supabase = await createClient();
  const { error: removeError } = await supabase
    .from("goals")
    .update({
      is_priority: false,
    })
    .eq("is_priority", true);
  const { error: addError } = await supabase
    .from("goals")
    .update({
      is_priority: true,
    })
    .eq("id", id);

  if (removeError || addError) {
    console.error("Couldn't set goal as priority: ", { removeError, addError });
    return {
      error: "Wystąpił błąd przy ustawianiu priorytetu",
    };
  }

  revalidatePath("/goals");

  return {};
}
