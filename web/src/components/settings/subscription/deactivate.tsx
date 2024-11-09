"use client";

import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Dict } from "@/const/dict";
import { cancelOrReactivateSubscription } from "@/lib/subscription/actions";
import { Button, useDisclosure } from "@nextui-org/react";

export default function Deactivate({
  dict,
  subscription,
}: {
  dict: Dict["private"]["settings"]["subscription"]["active"]["deactivate"];
  subscription: Pick<Stripe.Subscription, "id" | "cancel_at_period_end">;
}) {
  const disclosure = useDisclosure();
  return (
    <>
      <Button
        className="border bg-white"
        disableRipple
        onClick={disclosure.onOpen}
      >
        {subscription.cancel_at_period_end ? dict.reactivate.label : dict.label}
      </Button>
      <ConfirmationModal
        disclosure={disclosure}
        dict={dict.modal}
        mutation={cancelOrReactivateSubscription}
      >
        <input type="hidden" name="subscription_id" value={subscription.id} />
        <input
          type="hidden"
          name="should_cancel"
          value={String(!subscription.cancel_at_period_end)}
        />
      </ConfirmationModal>
    </>
  );
}
