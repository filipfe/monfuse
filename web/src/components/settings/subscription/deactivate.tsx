"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dict } from "@/const/dict";
import { cancelOrReactivateSubscription } from "@/lib/subscription/actions";
import { useTransition } from "react";

export default function Deactivate({
  dict,
  subscription,
}: {
  dict: Dict["private"]["settings"]["subscription"]["active"]["deactivate"];
  subscription: Pick<Stripe.Subscription, "id" | "cancel_at_period_end">;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      {subscription.cancel_at_period_end ? (
        <form
          action={(formData) =>
            startTransition(async () => {
              await cancelOrReactivateSubscription(formData);
            })
          }
        >
          <input type="hidden" name="subscription_id" value={subscription.id} />
          <input type="hidden" name="should_cancel" value="false" />
          <Button type="submit" loading={isPending} variant="outline">
            {dict.reactivate.label}
          </Button>
        </form>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{dict.label}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dict.modal.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dict.modal.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">{dict.modal.cancel}</Button>
              </AlertDialogCancel>
              <form
                action={(formData) =>
                  startTransition(async () => {
                    await cancelOrReactivateSubscription(formData);
                  })
                }
              >
                <AlertDialogAction asChild>
                  <Button loading={isPending} type="submit">
                    {dict.modal.proceed}
                  </Button>
                </AlertDialogAction>
                <input
                  type="hidden"
                  name="subscription_id"
                  value={subscription.id}
                />
                <input type="hidden" name="should_cancel" value="true" />
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
