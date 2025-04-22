"use server";

import stripe from "@/utils/stripe/server";
import Stripe from "stripe";
import { createClient as createDefaultClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getSubscription(user_id: string): Promise<
  SupabaseSingleRowResponse<Subscription | undefined>
> {
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

  const { data, error } = await supabaseServiceRole
    .schema("stripe")
    .from("subscriptions")
    .select("attrs")
    .eq("customer", user_id)
    .maybeSingle()
    .overrideTypes<{ attrs: Subscription }, { merge: false }>();

  if (error) {
    console.error(error);
    return {
      result: null,
      error: "Could not retrieve subscription",
    };
  }

  const subscription = data?.attrs;

  if (
    subscription &&
    subscription.status !== "active" && subscription.status !== "trialing" &&
    subscription.status !== "paused"
  ) {
    const { payment_intent } = await stripe.invoices.retrieve(
      subscription.latest_invoice as string,
    );

    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent as string,
    );

    subscription.client_secret = paymentIntent.client_secret as string;
  }

  return {
    result: subscription,
  };
}

export async function createSubscription(
  settings: Settings,
) {
  try {
    const prices = await stripe.prices.search({
      query: `product:"${process.env.STRIPE_PRODUCT_ID}" active:"true"`,
    });
    if (prices.data.length === 0) {
      throw new Error(`Couldn't find price for ${settings.currency}`);
    }
    const settingsCurrencyPrice = prices.data.find((price) =>
      price.currency === settings.currency.toLowerCase()
    );
    let price = settingsCurrencyPrice;
    if (!settingsCurrencyPrice) {
      price = prices.data.find((price) => price.currency === "usd");
    }
    if (!price) {
      throw new Error(`Couldn't find price for USD`);
    }
    await stripe.subscriptions.create({
      customer: settings.id,
      items: [
        {
          price: price.id,
        },
      ],
      payment_settings: { save_default_payment_method: "on_subscription" },
      ...(!settings.has_used_trial
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

    // subscription = { ...newSubscription, is_trial: !settings.has_used_trial };

    // if (settings.has_used_trial) {
    //   client_secret = (
    //     (newSubscription.latest_invoice as Stripe.Invoice)
    //       .payment_intent as Stripe.PaymentIntent
    //   ).client_secret;
    // }

    revalidatePath("/settings/subscription");

    return {
      error: false,
      // result: {
      //   ...(subscription as Subscription),
      //   client_secret: client_secret as string,
      // },
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
      // error: (err as Error).message,
      // result: null,
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

export async function resumeSubscription(id: string) {
  try {
    await stripe.subscriptions.resume(
      id,
      {
        expand: ["latest_invoice.payment_intent"],
      },
    );
    // const client_secret = (
    //   (newSubscription.latest_invoice as Stripe.Invoice)
    //     .payment_intent as Stripe.PaymentIntent
    // ).client_secret as string;

    revalidatePath("/settings/subscription");

    // return client_secret;
    return {
      error: false,
    };
  } catch (err) {
    console.error("Couldn't resume subscription: ", err);
    return {
      error: true,
    };
  }
}
