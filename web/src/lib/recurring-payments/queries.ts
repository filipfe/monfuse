import { createClient } from "@/utils/supabase/client";
import useSWR, { SWRConfiguration } from "swr";

export async function getPastRecurringPayments(
  params: SearchParams,
): Promise<Payment[]> {
  const supabase = createClient();
  let query = supabase
    // .rpc("get_recurring_payments_timeline_data", {
    //   p_offset: typeof params.page === "number" ? (params.page + 1) * 8 : 0,
    // })
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .eq("recurring", true)
    .order("issued_at", { ascending: false })
    .returns<Payment[]>();

  if (typeof params.page === "number") {
    query = query.range(8 * params.page, params.page * 8 + 8);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getActivePayments(
  page: number,
): Promise<{ count: number; results: RecurringPayment[] }> {
  const supabase = createClient();

  const { data: results, error } = await supabase.rpc(
    "get_recurring_payments_active_payments",
    { p_page: page },
  );

  if (error) throw new Error(error.message);

  return results;
}

export const useActivePayments = (
  page: number,
  config?: SWRConfiguration<{ count: number; results: RecurringPayment[] }>,
) =>
  useSWR(
    ["active-payments", page],
    ([_, page]) => getActivePayments(page),
    config,
  );

async function getCalendarRecords(
  timezone: string,
  month: number,
  year: number,
): Promise<TimelineEntry[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_recurring_payments_timeline",
    {
      p_timezone: timezone,
      p_month: month + 1,
      p_year: year,
    },
  );

  if (error) throw new Error(error.message);

  return data;
}

export const useCalendarRecords = (
  timezone: string,
  month: number,
  year: number,
) =>
  useSWR(
    ["recurring-payments", "calendar", { timezone, month, year }],
    ([, , { timezone, month, year }]) =>
      getCalendarRecords(timezone, month, year),
    {
      revalidateOnFocus: false,
    },
  );

async function getUpcomingPayments(
  timezone: string,
): Promise<UpcomingPayment[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_recurring_payments_upcoming_payments",
    {
      p_timezone: timezone,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpcomingPayments = (
  timezone: string,
  config?: SWRConfiguration<UpcomingPayment[]>,
) =>
  useSWR(
    ["recurring-payments", "upcoming", timezone],
    ([, , timezone]) => getUpcomingPayments(timezone),
    config,
  );

export async function deleteRecurringPayment(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("recurring_payments")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
    };
  }

  return {};
}
