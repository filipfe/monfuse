// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "supabase";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";
import { Locale } from "../_shared/types.ts";

const STRIPE_API_KEY = Deno.env.get("STRIPE_API_KEY");
const STRIPE_WEBHOOK_SIGNING_SECRET = Deno.env.get(
  "STRIPE_WEBHOOK_SIGNING_SECRET",
);
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (
  !STRIPE_API_KEY || !STRIPE_WEBHOOK_SIGNING_SECRET || !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        STRIPE_API_KEY,
        STRIPE_WEBHOOK_SIGNING_SECRET,
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      }).filter((
        [_k, value],
      ) => !value).map(([k]) => k).join(", ")
    }`,
  );
}

const subscriptionTitle: Record<Locale, string> = {
  pl: "Subskrypcja Monfuse",
  en: "Monfuse Subscription",
  es: "Suscripción Monfuse",
};

const stripe = new Stripe(STRIPE_API_KEY);

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await req.text();

  let receivedEvent: Stripe.Event;

  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature as string,
      STRIPE_WEBHOOK_SIGNING_SECRET,
      undefined,
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });

  switch (receivedEvent.type) {
    case "invoice.payment_succeeded": {
      const invoice = receivedEvent.data.object;
      const userId = receivedEvent.data.object.customer as string;
      const { data: settings, error: settingsError } = await supabase.from(
        "settings",
      )
        .select(
          "language, insert_subscription_expense, subscription_expense_label",
        )
        .eq("user_id", userId)
        .single();

      if (settingsError) {
        console.error(
          `Couldn't retrieve settings for ${userId} customer: `,
          settingsError,
        );
      } else if (settings.insert_subscription_expense && invoice.total > 0) {
        const { error } = await supabase.from("expenses").insert({
          title: subscriptionTitle[settings.language as Locale],
          user_id: userId,
          amount: ["JPY", "KRW", "IDR"].includes(invoice.currency.toUpperCase())
            ? invoice.total
            : invoice.total / 100,
          currency: invoice.currency.toUpperCase(),
          label: settings.subscription_expense_label || null,
        });
        error && console.error("Couldn't insert expense: ", error);
      }
      break;
    }
    case "customer.subscription.created": {
      const userId = receivedEvent.data.object.customer as string;
      const { error: updateError } = await supabase.from("profiles")
        .update({ has_used_trial: true })
        .eq("id", userId);
      updateError &&
        console.error("Couldn't update has_used_trial: ", updateError);
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
