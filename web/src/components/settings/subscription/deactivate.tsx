"use client";

import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Dict } from "@/const/dict";
import { cancelOrReactivateSubscription } from "@/lib/subscription/actions";
import { Button, useDisclosure } from "@heroui/react";
import { useTransition } from "react";

export default function Deactivate({
  dict,
  subscription,
}: {
  dict: Dict["private"]["settings"]["subscription"]["active"]["deactivate"];
  subscription: Pick<Stripe.Subscription, "id" | "cancel_at_period_end">;
}) {
  const [isPending, startTransition] = useTransition();
  const disclosure = useDisclosure();
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
          <Button
            type="submit"
            isDisabled={isPending}
            disabled={isPending}
            className="border bg-white"
            disableRipple
          >
            {dict.reactivate.label}
          </Button>
        </form>
      ) : (
        <Button
          className="border bg-white"
          disableRipple
          onClick={disclosure.onOpen}
        >
          {dict.label}
        </Button>
      )}
      <ConfirmationModal
        disclosure={disclosure}
        dict={dict.modal}
        mutation={cancelOrReactivateSubscription}
      >
        <input type="hidden" name="subscription_id" value={subscription.id} />
        <input type="hidden" name="should_cancel" value="true" />
      </ConfirmationModal>
    </>
  );
}
