"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { createClient as createDefaultClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getOrCreateSubscription(): Promise<
  SupabaseSingleRowResponse<Subscription>
> {
  const supabase = createClient();

  const { data: user, error: authError } = await supabase
    .from("profiles")
    .select("id, has_used_trial, settings(currency)").returns<
    { id: string; has_used_trial: boolean; settings: { currency: string } }[]
  >()
    .single();

  if (authError) {
    console.error(authError);
    return {
      error: authError.message,
      result: null,
    };
  }

  const supabaseServiceRole = createDefaultClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { data: pastSubscription, error } = await supabaseServiceRole
    .schema("stripe")
    .from("subscriptions")
    .select("attrs")
    .eq("customer", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {
      result: null,
      error: "Could not retrieve subscription",
    };
  }

  try {
    let client_secret: string | null = null;

    let subscription: Omit<Subscription, "plan" | "client_secret"> | null =
      pastSubscription?.attrs;

    if (!subscription) {
      const prices = await stripe.prices.search({
        query: `product:"${process.env.STRIPE_PRODUCT_ID}" active:"true"`,
      });
      if (prices.data.length === 0) {
        throw new Error(`Couldn't find price for ${user.settings.currency}`);
      }
      const settingsCurrencyPrice = prices.data.find((price) =>
        price.currency === user.settings.currency.toLowerCase()
      );
      let price = settingsCurrencyPrice;
      if (!settingsCurrencyPrice) {
        price = prices.data.find((price) => price.currency === "usd");
      }
      if (!price) {
        throw new Error(`Couldn't find price for USD`);
      }
      const newSubscription = await stripe.subscriptions.create({
        customer: user.id,
        items: [
          {
            price: price.id,
          },
        ],
        payment_settings: { save_default_payment_method: "on_subscription" },
        ...(!user.has_used_trial
          ? ({
            trial_period_days: 7,
            trial_settings: {
              end_behavior: {
                missing_payment_method: "pause",
              },
            },
          })
          : {
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
          }),
      });
      subscription = { ...newSubscription, is_trial: !user.has_used_trial };
      if (user.has_used_trial) {
        client_secret = (
          (newSubscription.latest_invoice as Stripe.Invoice)
            .payment_intent as Stripe.PaymentIntent
        ).client_secret;
      }
    } else if (
      subscription.status !== "active" && subscription.status !== "trialing" &&
      subscription.status !== "paused"
    ) {
      const { payment_intent } = await stripe.invoices.retrieve(
        subscription.latest_invoice as string,
      );

      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment_intent as string,
      );

      client_secret = paymentIntent.client_secret;
    }

    return {
      result: {
        ...(subscription as Subscription),
        client_secret: client_secret as string,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      error: (err as Error).message,
      result: null,
    };
  }
}

export async function cancelOrReactivateSubscription(formData: FormData) {
  const subscriptionId = formData.get("subscription_id") as string;
  const shouldCancel = formData.get("should_cancel") as string;
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: shouldCancel === "true",
    });
    revalidatePath("/settings/subscription");
    return {};
  } catch (err) {
    return {
      error: (err as Error).message,
    };
  }
}

export async function resumeSubscription(id: string): Promise<string | null> {
  try {
    const newSubscription = await stripe.subscriptions.resume(
      id,
      {
        expand: ["latest_invoice.payment_intent"],
      },
    );
    const client_secret = (
      (newSubscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent
    ).client_secret as string;
    return client_secret;
  } catch (err) {
    console.error("Couldn't resume subscription: ", err);
    return null;
  }
}
