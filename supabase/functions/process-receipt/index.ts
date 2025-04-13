import { corsHeaders } from "../_shared/cors.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { createClient } from "supabase";
import { ChatCompletionContentPart } from "https://deno.land/x/openai@v4.51.0/resources/chat/completions.ts";
import { zodResponseFormat } from "https://deno.land/x/openai@v4.69.0/helpers/zod.ts";
import { z } from "npm:zod";
import openai from "../_shared/openai.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

type UploadedFile = {
  id: string;
  signedUrl?: string;
  path: string | null;
  error?: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const NGROK_URL = Deno.env.get("NGROK_URL");

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    `Environment variables missing: ${
      SUPABASE_URL ? "SUPABASE_ANON_KEY" : "SUPABASE_URL"
    }`,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const form = await multiParser(req);

    if (!form) {
      return new Response("Request error: No files have been found", {
        status: 400,
      });
    }

    const files = form.files as Record<string, FormFile>;

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    });

    let user = form.fields.user_id ? { id: form.fields.user_id } : null;

    if (!user) {
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();
      if (error || !supabaseUser) {
        return new Response(
          `Auth error: ${error?.message || "User not found"}`,
          { status: 422 },
        );
      }
      user = supabaseUser;
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const uuid in files) {
      const file = files[uuid];
      const { data: upload, error: uploadError } = await supabase.storage
        .from("docs")
        .upload(`${user.id}/${uuid}-${file.filename}`, file.content, {
          contentType: file.contentType,
          cacheControl: "3600",
          upsert: false,
        });
      if (upload) {
        const { data, error: shareError } = await supabase.storage
          .from("docs")
          .createSignedUrl(upload.path, 3600);
        const url = data ? new URL(data.signedUrl) : null;
        const pathname = url ? url.pathname : null;
        const signedUrl = data
          ? NGROK_URL
            ? `${NGROK_URL}${pathname}${url?.search || ""}`
            : data.signedUrl
          : undefined;
        uploadedFiles.push({
          id: uuid,
          path: upload.path,
          signedUrl,
          error: shareError?.message,
        });
      } else {
        uploadedFiles.push({
          id: uuid,
          error: uploadError?.message,
          path: null,
        });
      }
    }

    const withSignedUrl = uploadedFiles.filter((file) => file.signedUrl);

    if (withSignedUrl.length === 0) {
      return new Response("Request error: Couldn't retrieve signed URLs", {
        status: 400,
      });
    }

    const content: ChatCompletionContentPart[] = withSignedUrl.map((file) => ({
      type: "image_url",
      image_url: {
        url: file.signedUrl!,
      },
    }));

    const textPrompt =
      `Extract finance information from the receipts and invoices. Analyze context and classify each operation either as 'income' or 'expense'. Generate a list of operations.
The 'id' and 'doc_path' for each image are available on the image's index in this array:
  [${
        uploadedFiles
          .map(({ id, path }) => `{ id: ${id}, doc_path: ${path} }`)
          .join(", ")
      }]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: zodResponseFormat(
        z.object({
          operations: z.array(z.object({
            id: z.string(),
            title: z.string().min(1),
            issued_at: z.string(),
            amount: z.number().positive(),
            currency: z.string().length(3),
            type: z.enum(["income", "expense"]),
            doc_path: z.string().nullable(),
          })),
        }),
        "operations",
      ),
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: textPrompt }, ...content],
        },
      ],
    });
    const response = completion.choices[0].message.content;

    console.log("Generated the following response: ", response);

    return new Response(response, {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Couldn't process receipt: ", err);
    return new Response(`Internal server error: ${err}`, { status: 500 });
  }
});
