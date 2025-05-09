"use client";

import Toast from "@/components/ui/toast";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import { updatePreferences } from "@/lib/settings/actions";
import { useEffect, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";

type Props = {
  dict: Dict["private"]["settings"]["preferences"]["default-currency"]["select"] & {
    _success: string;
  };
  defaultValue: string;
};

export default function CurrencySelect({ dict, defaultValue }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(defaultValue);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!formRef.current || selected === defaultValue) return;
    formRef.current.requestSubmit();
  }, [selected]);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await updatePreferences(formData);
      if (res?.error) {
        toast.custom((t) => <Toast {...t} message={res.error} type="error" />);
      } else {
        toast.custom((t) => (
          <Toast {...t} type="success" message={dict._success} />
        ));
      }
    });

  return (
    <form action={action} ref={formRef}>
      <UniversalSelect
        name="currency"
        label={dict.label}
        value={selected}
        disabled={isPending}
        elements={CURRENCIES}
        onValueChange={(value) => setSelected(value)}
      />
      <input type="hidden" name="name" value="currency" />
      <input type="hidden" name="value" value={selected} />
    </form>
  );
}
