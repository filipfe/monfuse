"use client";

import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Dict } from "@/const/dict";
import { cancelSubscription } from "@/lib/subscription/actions";
import { Button, useDisclosure } from "@nextui-org/react";

export default function Deactivate({
  dict,
  subscriptionId,
}: {
  dict: Dict["private"]["settings"]["subscription"]["active"]["deactivate"];
  subscriptionId: string;
}) {
  const disclosure = useDisclosure();
  return (
    <>
      <Button className="border bg-white" disableRipple>
        {dict.label}
      </Button>
      <ConfirmationModal
        disclosure={disclosure}
        dict={dict.modal}
        mutation={cancelSubscription}
      >
        <input type="hidden" name="subscription_id" value={subscriptionId} />
      </ConfirmationModal>
    </>
  );
}
