import supabase from "../supabase.ts";
import { Payment, ProcessReturn } from "../types.ts";

export async function insertOperations(
  operations: Payment[],
  user: Profile,
): Promise<Omit<ProcessReturn, "operations">> {
  const { data: ids, error } = await supabase.rpc("actions_insert_operations", {
    p_operations: operations.map((op) => ({ ...op, from_telegram: true })),
    p_user_id: user.id,
  });
  if (!error) {
    console.log("Inserted operations: ", ids);
    return {
      reply: "add.success",
      ids,
    };
  } else {
    console.error(error);
    return {
      ids: [],
      reply: "error",
    };
  }
}
