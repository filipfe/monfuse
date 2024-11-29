"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTimeline(
  timezone: string,
): Promise<SupabaseResponse<TimelineEntry>> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_recurring_payments_timeline",
    {
      p_timezone: timezone,
    },
  );

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return { results: data };
}

export async function getRecurringPayments(
  searchParams: SearchParams,
): Promise<SupabaseResponse<WithId<RecurringPayment>>> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_recurring_payments_active_payments",
    {
      p_page: searchParams.page || 1,
    },
  );

  if (error) {
    return {
      results: [],
      error: error.message,
      count: 0,
    };
  }

  return {
    results: data.results,
    count: data.count || 0,
  };
}

export async function getLatestPayments(): Promise<SupabaseResponse<Payment>> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .eq("recurring", true)
    .order("issued_at", { ascending: false })
    .order("amount", { ascending: false })
    .order("id")
    .limit(3);

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

export async function addRecurringPayment(formData: FormData) {
  const title = formData.get("title") as string;
  const amount = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const start_datetime = formData.get("start_datetime") as string;
  const type = formData.get("type") as string;
  const interval_unit = formData.get("interval_unit") as string;
  const interval_amount = formData.get("interval_amount") as string;

  const supabase = createClient();

  const { error } = await supabase.from("recurring_payments").insert({
    title,
    amount,
    start_datetime,
    interval_amount,
    interval_unit,
    currency,
    type,
  });

  if (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }

  revalidatePath("/recurring-payments");
  redirect("/recurring-payments");
}
