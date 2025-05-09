import { Button } from "@/components/ui/button";
import { Dict } from "@/const/dict";
import toast from "@/utils/toast";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Hatch } from "ldrs/react";
import { FormEvent, useState } from "react";

export default function Checkout({
  dict,
}: {
  dict: Dict["private"]["settings"]["subscription"]["form"]["_submit"];
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env
          .NEXT_PUBLIC_SITE_URL!}/settings/subscription/status`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast({
        type: "error",
        message: error.message,
      });
    } else {
      toast({
        type: "error",
        message: "An unexpected error occurred",
      });
    }

    setIsLoading(false);
  };

  const isDisabled = isLoading || !stripe || !elements;

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        type="submit"
        disabled={isDisabled}
        id="submit"
        className="w-full mt-4 font-medium"
      >
        {isLoading && <Hatch stroke={1.5} size={14} color="white" />}
        {dict}
      </Button>
    </form>
  );
}
