import openai from "../openai.ts";
import { insertOperations } from "../commands/add.ts";
import supabase from "../supabase.ts";
import { ProcessReturn, Profile } from "../types.ts";
import { zodResponseFormat } from "https://deno.land/x/openai@v4.69.0/helpers/zod.ts";
import { z } from "npm:zod";

const OperationSchema = z.object({
  title: z.string(),
  amount: z.number(),
  currency: z.string(),
  type: z.enum(["income", "expense"]),
  label: z.string().nullable(),
});

export default async function processText(
  message: string,
  user: Profile,
): Promise<ProcessReturn> {
  const { data } = await supabase.rpc("get_telegram_user_labels", {
    p_user_id: user.id,
  });

  const labels = data || [];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: zodResponseFormat(
      z.object({
        operations: z.array(OperationSchema),
        message: z.string().optional(),
      }),
      "operations",
    ),
    messages: [{
      role: "system",
      content:
        `You're private financial accountant. You generate list operations based on user's prompt. Classify each operation either as 'income' or 'expense'.
User's native language: ${user.settings.language} - use it for 'title' and 'label' unless user specified otherwise
User's default currency: ${user.settings.currency} - use it in case client didn't mention any other

- Only insert 'label' when you've classified operation as 'expense'
- If there's no matching label, you can come up with one yourself but choose very general naming
- If there's no good label to assign, don't include label field in the object

List of available labels:
${labels.length > 0 ? labels.join(",\n") : ""}`,
    }, {
      role: "user",
      "content": message,
    }],
  });

  const response = completion.choices[0].message.content;

  if (typeof response !== "string") {
    console.error("Completion error: Returned a non-string response", {
      completion,
    });

    return {
      reply: "error",
      ids: [],
      operations: [],
    };
  }

  try {
    const data = JSON.parse(response);
    if (!Array.isArray(data.operations) || data.operations.length === 0) {
      return {
        operations: [],
        ids: [],
        reply: "error.text-irrelevant-message",
      };
    }
    const res = await insertOperations(
      data.operations,
      user,
    );
    return { ...res, operations: data.operations };
  } catch (err) {
    console.log("Parse error: Couldn't parse the completion response", {
      response,
      err,
    });
    return {
      reply: "error",
      ids: [],
      operations: [],
    };
  }
}
