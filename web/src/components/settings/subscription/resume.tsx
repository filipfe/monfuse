"use client";

import { Button } from "@/components/ui/button";
import { resumeSubscription } from "@/lib/subscription/actions";
import { useTransition } from "react";

type Props = {
  subscription_id: string;
  dict: {
    label: string;
  };
};

export default function Resume({ subscription_id, dict }: Props) {
  const [isPending, startTransition] = useTransition();

  const action = (_formData: FormData) => {
    startTransition(async () => {
      await resumeSubscription(subscription_id);
    });
  };

  return (
    <form action={action}>
      <Button
        type="submit"
        loading={isPending}
        variant="outline"
        className="bg-white hover:bg-light"
      >
        {dict.label}
      </Button>
    </form>
  );
}
