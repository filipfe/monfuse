import { Dict } from "@/const/dict";
import stripe from "@/utils/stripe/server";
import Create from "./create";
import Stripe from "stripe";

type Props = {
  dict: Dict["private"]["settings"]["subscription"]["create"] & {
    month: string;
  };
  settings: Settings;
};

export default async function Canceled({ dict, settings }: Props) {
  let price = 0;

  let prices: Stripe.Price[] = [];

  if (settings.has_used_trial) {
    prices = await stripe.prices
      .search({
        query: `currency:"${settings.currency.toLowerCase()}" product:"${
          process.env.STRIPE_PRODUCT_ID
        }"`,
      })
      .then((res) => res.data);

    if (prices.length > 0) {
      price = ["JPY", "KRW", "IDR"].includes(prices[0].currency.toUpperCase())
        ? (prices[0].unit_amount as number)
        : (prices[0].unit_amount as number) / 100;
    } else {
      price = 12;
    }
  }

  return (
    <div className="px-10 py-8 border bg-light rounded-md flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h3 className="sm:text-lg lg:text-xl">
          {dict[settings.has_used_trial ? "canceled" : "trial"].title}
        </h3>
        <p className="text-sm">
          {dict[settings.has_used_trial ? "canceled" : "trial"].description}
        </p>
      </div>
      <p className="inline-flex items-end">
        <strong className="text-2xl sm:text-3xl lg:text-4xl">
          {new Intl.NumberFormat(settings.language, {
            style: "currency",
            currency: !settings.has_used_trial
              ? settings.currency
              : prices.length > 0
              ? settings.currency
              : "USD",
          }).format(price)}
        </strong>
        <sub className="text-sm mb-1 ml-2 opacity-80">
          / {settings.has_used_trial ? dict.month : dict.trial.days}
        </sub>
      </p>
      <Create dict={dict.start} settings={settings} />
    </div>
  );
}
