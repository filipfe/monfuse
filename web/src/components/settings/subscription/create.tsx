"use client";

import { Button } from "@/components/ui/button";
import { createSubscription } from "@/lib/subscription/actions";
import { useTransition } from "react";

type Props = {
  settings: Settings;
  dict: {
    label: string;
  };
};

export default function Create({ dict, settings }: Props) {
  const [isPending, startTransition] = useTransition();

  const action = (_formData: FormData) => {
    startTransition(async () => {
      await createSubscription(settings);
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
