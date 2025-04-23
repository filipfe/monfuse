"use client";

import getStripe from "@/utils/stripe/client";
import Stripe from "stripe";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Hatch } from "ldrs/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Dict } from "@/const/dict";

type Props = {
  dict: Dict["private"]["settings"]["subscription"]["status"];
};

export default function SubscriptionModal({ dict }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] =
    useState<Stripe.PaymentIntent.Status>("processing");
  const searchParams = useSearchParams();

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    if (!clientSecret) return;
    (async () => {
      const stripe = await getStripe();
      if (!stripe) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      if (!paymentIntent) return;
      setStatus(paymentIntent.status);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Dialog open>
      <DialogContent>
        {isLoading ? (
          <>
            <DialogTitle className="sr-only" />
            <div className="flex-1 grid place-content-center min-h-48">
              <Hatch size={32} />
            </div>
          </>
        ) : (
          <Fragment>
            <DialogHeader>
              <DialogTitle>
                {status in dict.title
                  ? dict.title[status as keyof typeof dict.title]
                  : dict.description.default}
              </DialogTitle>
            </DialogHeader>
            <div>
              <p className="text-sm opacity-80">
                {status === "succeeded"
                  ? dict.description.succeeded
                  : dict.description.default}
              </p>
            </div>
            <DialogFooter>
              <Button asChild>
                <Link
                  href={status === "succeeded" ? "/" : "/settings/subscription"}
                >
                  {status === "succeeded" ? "Rozpocznij" : "Spróbuj ponownie"}
                </Link>
              </Button>
            </DialogFooter>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
