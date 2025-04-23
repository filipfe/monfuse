"use server";

import dateFormat from "@/utils/formatters/dateFormat";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLatestOperations(
  from?: string,
): Promise<SupabaseResponse<Payment>> {
  const supabase = await createClient();
  let query = supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .order("issued_at", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .limit(20);

  if (from) {
    query = query.eq(`from_${from}`, true);
  }

  const { data: results, error } = await query;

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

export async function addOperations(
  formData: FormData,
  timezone: string,
): Promise<SupabaseResponse<Operation>> {
  const type = formData.get("type")!.toString() as OperationType;
  const label = formData.get("label")?.toString() || undefined;
  const data = formData.get("data")?.toString();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return {
      results: [],
      error: "Błąd autoryzacji, spróbuj zalogować się ponownie!",
    };
  }

  let error = null;

  if (data) {
    try {
      const operations = JSON.parse(data);

      const updatedOperations = operations.map((op: Operation) => ({
        ...op,
        issued_at: dateFormat(op.issued_at, timezone),
      }));

      const { error: insertError } = await supabase.rpc(
        "actions_insert_operations",
        {
          p_operations: updatedOperations,
          p_user_id: user.id,
          p_type: type,
          p_label: label,
        },
      );

      error = insertError;
    } catch (err) {
      console.warn("Couldn't parse operations: ", err);
      return {
        results: [],
        error: "Wystąpił błąd przy dodawaniu operacji, spróbuj ponownie!",
      };
    }
  } else {
    const title = formData.get("title")?.toString();
    const amount = formData.get("amount")?.toString();
    const currency = formData.get("currency")?.toString();
    const issued_at = formData.get("issued_at")?.toString();
    const description = formData.get("description")?.toString();

    const operation: Record<string, string | undefined> = {
      title,
      amount,
      currency,
      description,
      ...(type === "expense" ? { label } : {}),
    };

    if (issued_at) {
      const currentDate = new Date();
      const formattedCurrentDate = dateFormat(
        currentDate,
        timezone,
        "yyyy-MM-dd",
      );
      const formattedIssuedAt = dateFormat(issued_at, timezone, "yyyy-MM-dd");

      if (formattedIssuedAt === formattedCurrentDate) {
        operation.issued_at = dateFormat(currentDate, timezone);
      } else {
        operation.issued_at = dateFormat(issued_at, timezone);
      }
    }

    const { error: insertError } = await supabase
      .from(`${type}s`)
      .insert(operation);

    error = insertError;
  }

  if (error) {
    console.error("Couldn't add operation: ", error);
    return {
      error: "Wystąpił błąd przy dodawaniu operacji, spróbuj ponownie!",
      results: [],
    };
  }

  const path = type === "expense" ? "/expenses" : "/incomes";

  revalidatePath("/dashboard");
  redirect(path);
}

export async function getOperationsStats(
  timezone: string,
  currency: string,
  type: string,
): Promise<SupabaseSingleRowResponse<OperationsStats>> {
  const supabase = await createClient();

  const { data: result, error } = await supabase.rpc("get_operations_stats", {
    p_currency: currency,
    p_type: type,
    p_timezone: timezone,
  });

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

export async function getPortfolioBudgets(): Promise<SupabaseResponse<Budget>> {
  const supabase = await createClient();
  const { data: results, error } = await supabase.rpc(
    "get_dashboard_portfolio_budgets",
  );

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

export async function updateOperation(
  formData: FormData,
  timezone: string,
  prevIssuedAt: string,
) {
  try {
    const id = formData.get("id")?.toString();
    const type = formData.get("type")?.toString();
    const issued_at = formData.get("issued_at")?.toString();

    const operation: Record<string, string | undefined> = {
      title: formData.get("title")?.toString(),
      amount: formData.get("amount")?.toString(),
      currency: formData.get("currency")?.toString(),
      description: formData.get("description")?.toString(),
      label: formData.get("label")?.toString(),
    };

    if (issued_at && issued_at !== prevIssuedAt) {
      const currentDate = new Date();
      const formattedCurrentDate = dateFormat(
        currentDate,
        timezone,
        "yyyy-MM-dd",
      );
      const formattedIssuedAt = dateFormat(issued_at, timezone);

      if (issued_at === formattedCurrentDate) {
        operation.issued_at = dateFormat(currentDate, timezone);
      } else {
        operation.issued_at = formattedIssuedAt;
      }
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from(`${type}s`)
      .update(operation)
      .eq("id", id);
    if (error) {
      console.error("Edit error: While updating", error);
      return {
        error: "Wystąpił błąd, spróbuj ponownie!",
        results: [],
      };
    }

    revalidatePath(`/${type}s`);
    revalidatePath("/");

    return {
      error: null,
      results: [],
    };
  } catch (err) {
    console.error("Edit error: Couldn't update operation", err);
    return {
      error: "Wystąpił błąd, spróbuj ponownie!",
      results: [],
    };
  }
}

export async function deleteOperations(formData: FormData) {
  const type = formData.get("type") as string;
  if (!type) {
    return {
      error: "field:type",
    };
  }
  try {
    const ids = JSON.parse(formData.get("ids") as string);
    const supabase = await createClient();
    const { error } = await supabase.from(`${type}s`)
      .delete()
      .in("id", ids);

    if (error) {
      return {
        error: "query",
      };
    }

    revalidatePath(`/${type}s`);

    return {
      error: null,
    };
  } catch (err) {
    return {
      error: "field:ids",
    };
  }
}
